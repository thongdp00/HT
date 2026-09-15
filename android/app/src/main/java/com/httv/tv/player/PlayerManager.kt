package com.httv.tv.player

import android.content.Context
import android.net.Uri
import android.util.Base64
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MimeTypes
import androidx.media3.common.PlaybackException
import androidx.media3.common.Player
import androidx.media3.datasource.DefaultDataSource
import androidx.media3.datasource.okhttp.OkHttpDataSource
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory
import androidx.media3.ui.PlayerView
import com.httv.tv.model.Channel
import okhttp3.OkHttpClient
import java.security.SecureRandom
import java.security.cert.X509Certificate
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager

class PlayerManager(
    private val context: Context,
    private val playerView: PlayerView,
    private val onPlaybackState: (state: Int) -> Unit,
    private val onError: (error: PlaybackException, canRetry: Boolean) -> Unit
) {

    private var exoPlayer: ExoPlayer? = null
    private var currentChannel: Channel? = null
    private var candidateUrls = mutableListOf<String>()
    private var candidateIndex = 0

    // OkHttpClient with SSL verification bypass for IPTV sports links
    private val okHttpClient: OkHttpClient by lazy {
        val trustAllCerts = arrayOf<TrustManager>(object : X509TrustManager {
            override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
            override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) {}
            override fun getAcceptedIssuers(): Array<X509Certificate> = arrayOf()
        })

        val sslContext = SSLContext.getInstance("SSL")
        sslContext.init(null, trustAllCerts, SecureRandom())

        OkHttpClient.Builder()
            .sslSocketFactory(sslContext.socketFactory, trustAllCerts[0] as X509TrustManager)
            .hostnameVerifier { _, _ -> true }
            .connectTimeout(8, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .build()
    }

    init {
        setupPlayer()
    }

    private fun setupPlayer() {
        val httpDataSourceFactory = OkHttpDataSource.Factory(okHttpClient)
            .setUserAgent("Dalvik/2.1.0 (Linux; U; Android 11; TV)")

        val dataSourceFactory = DefaultDataSource.Factory(context, httpDataSourceFactory)
        val mediaSourceFactory = DefaultMediaSourceFactory(dataSourceFactory)

        exoPlayer = ExoPlayer.Builder(context)
            .setMediaSourceFactory(mediaSourceFactory)
            .build()
            .apply {
                playWhenReady = true
                repeatMode = Player.REPEAT_MODE_OFF

                addListener(object : Player.Listener {
                    override fun onPlaybackStateChanged(playbackState: Int) {
                        onPlaybackState(playbackState)
                    }

                    override fun onPlayerError(error: PlaybackException) {
                        handlePlaybackError(error)
                    }
                })
            }

        playerView.player = exoPlayer
    }

    fun playChannel(channel: Channel) {
        currentChannel = channel
        candidateUrls.clear()
        candidateUrls.add(channel.url)
        candidateUrls.addAll(channel.backupUrls)
        candidateIndex = 0

        playCurrentCandidate()
    }

    private fun playCurrentCandidate() {
        val channel = currentChannel ?: return
        if (candidateIndex >= candidateUrls.size) {
            onError(
                PlaybackException("Hết nguồn phát khả dụng cho kênh này", null, PlaybackException.ERROR_CODE_IO_UNSPECIFIED),
                false
            )
            return
        }

        val streamUrl = candidateUrls[candidateIndex]
        val uri = Uri.parse(streamUrl)

        val mediaItemBuilder = MediaItem.Builder()
            .setUri(uri)

        // Set mime type based on stream format
        when {
            streamUrl.contains(".m3u8") || channel.format == "hls" -> {
                mediaItemBuilder.setMimeType(MimeTypes.APPLICATION_M3U8)
            }
            streamUrl.contains(".mpd") || channel.format == "dash" -> {
                mediaItemBuilder.setMimeType(MimeTypes.APPLICATION_MPD)
            }
        }

        // Configure ClearKey DRM if present
        channel.drm?.let { drmConfig ->
            if (drmConfig.type.equals("clearkey", ignoreCase = true) && !drmConfig.key.isNullOrEmpty()) {
                val clearKeyDrmJson = buildClearKeyDrmJson(drmConfig.key)
                if (clearKeyDrmJson != null) {
                    val drmConfigBuilder = MediaItem.DrmConfiguration.Builder(C.CLEARKEY_NAME)
                        .setLicenseUri(Uri.parse("data:application/json;base64," + Base64.encodeToString(clearKeyDrmJson.toByteArray(), Base64.NO_WRAP)))
                    mediaItemBuilder.setDrmConfiguration(drmConfigBuilder.build())
                }
            }
        }

        exoPlayer?.let { player ->
            player.setMediaItem(mediaItemBuilder.build())
            player.prepare()
            player.play()
        }
    }

    private fun handlePlaybackError(error: PlaybackException) {
        if (candidateIndex + 1 < candidateUrls.size) {
            candidateIndex++
            onError(error, true)
            playCurrentCandidate()
        } else {
            onError(error, false)
        }
    }

    fun retry() {
        candidateIndex = 0
        playCurrentCandidate()
    }

    fun release() {
        exoPlayer?.release()
        exoPlayer = null
    }

    private fun buildClearKeyDrmJson(keyEntry: String): String? {
        // ClearKey keyEntry format is usually "hexKeyId:hexKey" or "keyId:key"
        val parts = keyEntry.split(":")
        if (parts.size != 2) return null

        val keyIdHex = parts[0].trim()
        val keyHex = parts[1].trim()

        val keyIdBase64 = hexToBase64Url(keyIdHex)
        val keyBase64 = hexToBase64Url(keyHex)

        return """{"keys":[{"kty":"oct","k":"$keyBase64","kid":"$keyIdBase64"}]}"""
    }

    private fun hexToBase64Url(hex: String): String {
        val len = hex.length
        val data = ByteArray(len / 2)
        for (i in 0 until len step 2) {
            data[i / 2] = ((Character.digit(hex[i], 16) shl 4) + Character.digit(hex[i + 1], 16)).toByte()
        }
        return Base64.encodeToString(data, Base64.URL_SAFE or Base64.NO_PADDING or Base64.NO_WRAP)
    }
}
