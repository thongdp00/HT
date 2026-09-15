package com.httv.tv.tv

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.util.Log
import androidx.tvprovider.media.tv.PreviewChannel
import androidx.tvprovider.media.tv.PreviewChannelHelper
import androidx.tvprovider.media.tv.PreviewProgram
import androidx.tvprovider.media.tv.TvContractCompat
import com.httv.tv.data.ChannelRepository
import com.httv.tv.model.Channel
import com.httv.tv.ui.MainActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Manages publishing and updating VTV1..VTV10 channels and preview programs
 * on the Android TV and Google TV Home Screen.
 */
object TvHomeScreenManager {

    private const val TAG = "TvHomeScreenManager"
    private const val CHANNEL_DISPLAY_NAME = "Kênh VTV - HT TV"
    private const val CHANNEL_DESCRIPTION = "Xem trực tiếp các kênh VTV1 - VTV10 trên HT TV"
    private const val APP_LINK_URI = "httv://channel/vtv1"

    /**
     * Filter channels strictly for VTV1 through VTV10, in numerical order,
     * preserving the real cleanName and logo from HT TV cards.
     */
    fun extractVtvChannels(allChannels: List<Channel>): List<Channel> {
        val result = mutableListOf<Channel>()
        for (num in 1..10) {
            val targetName = "VTV$num"
            val found = allChannels.find {
                it.cleanName.trim().equals(targetName, ignoreCase = true)
            } ?: allChannels.find {
                it.name.trim().equals(targetName, ignoreCase = true)
            } ?: allChannels.find {
                it.id.equals("vtv$num-hd", ignoreCase = true) || it.id.equals("vtv$num", ignoreCase = true)
            } ?: allChannels.find {
                val norm = it.cleanName.uppercase().replace(" ", "")
                norm == targetName || norm.startsWith("${targetName}HD")
            }
            if (found != null && !result.any { it.id == found.id }) {
                result.add(found)
            }
        }
        return result
    }

    /**
     * Publish or update the VTV1..VTV10 channels on Android TV Home Screen.
     */
    fun publishVtvChannels(context: Context, channels: List<Channel>? = null) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            Log.d(TAG, "Android TV Home Screen channels require Android 8.0+ (API 26+)")
            return
        }

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val channelList = if (!channels.isNullOrEmpty()) {
                    channels
                } else {
                    val repo = ChannelRepository(context)
                    repo.getChannels().first
                }

                val vtvChannels = extractVtvChannels(channelList)
                if (vtvChannels.isEmpty()) {
                    Log.w(TAG, "No VTV channels found to publish to Home Screen.")
                    return@launch
                }

                Log.d(TAG, "Publishing ${vtvChannels.size} VTV channels to Android TV Home Screen...")

                val helper = PreviewChannelHelper(context)
                val existingChannels = try {
                    helper.allChannels
                } catch (e: Throwable) {
                    Log.w(TAG, "Unable to query existing channels: ${e.message}")
                    emptyList<PreviewChannel>()
                }

                var homeChannel = existingChannels.firstOrNull {
                    it.displayName == CHANNEL_DISPLAY_NAME ||
                    it.appLinkIntentUri?.toString() == APP_LINK_URI
                }

                val homeChannelId: Long
                if (homeChannel == null) {
                    val channelBuilder = PreviewChannel.Builder()
                        .setType(TvContractCompat.Channels.TYPE_PREVIEW)
                        .setDisplayName(CHANNEL_DISPLAY_NAME)
                        .setDescription(CHANNEL_DESCRIPTION)
                        .setAppLinkIntentUri(Uri.parse(APP_LINK_URI))

                    homeChannelId = helper.publishChannel(channelBuilder.build())
                    Log.d(TAG, "Created Home Screen Channel with ID: $homeChannelId")
                    try {
                        TvContractCompat.requestChannelBrowsable(context, homeChannelId)
                    } catch (e: Throwable) {
                        Log.w(TAG, "Request browsable failed: ${e.message}")
                    }
                } else {
                    homeChannelId = homeChannel.id
                    Log.d(TAG, "Using existing Home Screen Channel ID: $homeChannelId")
                }

                // Delete old programs in this channel to ensure no stale entries
                try {
                    val existingPrograms = helper.queryProgramsForChannel(homeChannelId)
                    for (prog in existingPrograms) {
                        helper.deletePreviewProgram(prog.id)
                    }
                } catch (e: Throwable) {
                    Log.w(TAG, "Error cleaning old programs: ${e.message}")
                }

                // Publish VTV1 to VTV10 programs
                vtvChannels.forEachIndexed { index, ch ->
                    val intent = Intent(context, MainActivity::class.java).apply {
                        action = Intent.ACTION_VIEW
                        data = Uri.parse("httv://channel/${ch.id}")
                        putExtra("channel_id", ch.id)
                        putExtra("channel_name", ch.cleanName)
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    }

                    val programBuilder = PreviewProgram.Builder()
                        .setChannelId(homeChannelId)
                        .setTitle(ch.cleanName)
                        .setDescription("Xem trực tiếp kênh ${ch.cleanName} trên HT TV")
                        .setIntent(intent)
                        .setWeight(100 - index)
                        .setType(TvContractCompat.PreviewPrograms.TYPE_CLIP)
                        .setLive(true)

                    if (ch.logo.isNotEmpty()) {
                        programBuilder.setPosterArtUri(Uri.parse(ch.logo))
                    }

                    try {
                        helper.publishPreviewProgram(programBuilder.build())
                        Log.d(TAG, "Published PreviewProgram for: ${ch.cleanName} (Logo: ${ch.logo})")
                    } catch (e: Throwable) {
                        Log.e(TAG, "Failed to publish program for ${ch.cleanName}: ${e.message}")
                    }
                }

                Log.d(TAG, "Finished publishing VTV channels to Android TV Home Screen.")
            } catch (e: Throwable) {
                Log.e(TAG, "Failed to update Android TV Home Screen: ${e.message}", e)
            }
        }
    }
}
