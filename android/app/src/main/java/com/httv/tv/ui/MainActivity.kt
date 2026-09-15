package com.httv.tv.ui

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.KeyEvent
import android.view.View
import android.view.animation.Animation
import android.view.animation.LinearInterpolator
import android.view.animation.RotateAnimation
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.media3.common.Player
import androidx.recyclerview.widget.LinearLayoutManager
import coil.load
import com.httv.tv.R
import com.httv.tv.data.ChannelRepository
import com.httv.tv.databinding.ActivityMainBinding
import com.httv.tv.model.Category
import com.httv.tv.model.Channel
import com.httv.tv.player.PlayerManager
import com.httv.tv.tv.TvHomeScreenManager
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var channelRepository: ChannelRepository
    private var playerManager: PlayerManager? = null

    private var allChannels = listOf<Channel>()
    private var categories = listOf<Category>()
    private var currentChannelIndex = 0
    private var pendingChannelTarget: String? = null

    private val categoryAdapter by lazy { CategoryAdapter(::onCategorySelected) }
    private val channelAdapter by lazy { ChannelAdapter(::onChannelSelected) }

    private val handler = Handler(Looper.getMainLooper())
    private var osdHideRunnable: Runnable? = null
    private var numberInputRunnable: Runnable? = null
    private val numberInputBuffer = StringBuilder()

    private var lastBackPressTime = 0L
    private var vinylAnimation: RotateAnimation? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        channelRepository = ChannelRepository(this)
        handleIncomingIntent(intent)
        setupViews()
        setupPlayer()
        loadChannels()
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleIncomingIntent(intent)
    }

    private fun handleIncomingIntent(intent: Intent?) {
        if (intent == null) return

        val target = intent.getStringExtra("channel_id")
            ?: intent.getStringExtra("channel_name")
            ?: intent.data?.getQueryParameter("channel")
            ?: intent.data?.getQueryParameter("ch")
            ?: intent.data?.lastPathSegment

        if (!target.isNullOrBlank()) {
            pendingChannelTarget = target
            if (allChannels.isNotEmpty()) {
                selectAndPlayChannelTarget(target)
            }
        }
    }

    private fun selectAndPlayChannelTarget(target: String): Boolean {
        val cleanTarget = target.trim().lowercase().replace("-", "").replace("_", "").replace(" ", "")

        // 1. Exact ID match
        var match = allChannels.find { it.id.equals(target, ignoreCase = true) }

        // 2. Exact cleanName match
        if (match == null) {
            match = allChannels.find { it.cleanName.equals(target, ignoreCase = true) }
        }

        // 3. Normalized ID match
        if (match == null) {
            match = allChannels.find {
                it.id.lowercase().replace("-", "").replace("_", "").replace(" ", "") == cleanTarget
            }
        }

        // 4. Normalized cleanName match
        if (match == null) {
            match = allChannels.find {
                it.cleanName.lowercase().replace("-", "").replace("_", "").replace(" ", "") == cleanTarget
            }
        }

        // 5. Pattern match for VTV1..VTV10 (e.g. "vtv1", "vtv2", "vtv10")
        if (match == null) {
            val vtvRegex = Regex("""vtv(10|[1-9])""", RegexOption.IGNORE_CASE)
            val vtvNumMatch = vtvRegex.find(cleanTarget)
            if (vtvNumMatch != null) {
                val num = vtvNumMatch.groupValues[1]
                val vtvKey = "vtv$num"
                match = allChannels.find { ch ->
                    val chNorm = ch.cleanName.lowercase().replace(" ", "")
                    chNorm == vtvKey || chNorm.startsWith("${vtvKey}hd") || ch.id.lowercase().startsWith(vtvKey)
                }
            }
        }

        // 6. Substring match fallback
        if (match == null) {
            match = allChannels.find {
                it.cleanName.contains(target, ignoreCase = true) || it.name.contains(target, ignoreCase = true)
            }
        }

        if (match != null) {
            val index = allChannels.indexOf(match)
            if (index != -1) {
                currentChannelIndex = index
                playChannel(match)
                hideDrawer()
                Toast.makeText(this, "Đang mở: ${match.cleanName}", Toast.LENGTH_SHORT).show()
                pendingChannelTarget = null
                return true
            }
        }
        return false
    }

    private fun setupViews() {
        // Categories list setup
        binding.rvCategories.layoutManager = LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        binding.rvCategories.adapter = categoryAdapter

        // Channels list setup
        binding.rvChannels.layoutManager = LinearLayoutManager(this)
        binding.rvChannels.adapter = channelAdapter

        // Vinyl rotation animation for music channels
        vinylAnimation = RotateAnimation(
            0f, 360f,
            Animation.RELATIVE_TO_SELF, 0.5f,
            Animation.RELATIVE_TO_SELF, 0.5f
        ).apply {
            duration = 4000
            repeatCount = Animation.INFINITE
            interpolator = LinearInterpolator()
        }
    }

    private fun setupPlayer() {
        playerManager = PlayerManager(
            context = this,
            playerView = binding.playerView,
            onPlaybackState = { state ->
                runOnUiThread {
                    when (state) {
                        Player.STATE_BUFFERING -> {
                            binding.loadingLayout.visibility = View.VISIBLE
                            binding.tvLoadingMessage.text = getString(R.string.loading_stream)
                        }
                        Player.STATE_READY -> {
                            binding.loadingLayout.visibility = View.GONE
                        }
                        Player.STATE_ENDED -> {
                            binding.loadingLayout.visibility = View.GONE
                        }
                        Player.STATE_IDLE -> {
                            // Player idle
                        }
                    }
                }
            },
            onError = { error, canRetry ->
                runOnUiThread {
                    if (canRetry) {
                        binding.tvLoadingMessage.text = getString(R.string.playback_error)
                    } else {
                        binding.loadingLayout.visibility = View.VISIBLE
                        binding.tvLoadingMessage.text = getString(R.string.playback_error)
                    }
                }
            }
        )
    }

    private fun loadChannels() {
        binding.loadingLayout.visibility = View.VISIBLE
        binding.tvLoadingMessage.text = getString(R.string.loading_channels)

        lifecycleScope.launch {
            val (channels, cats) = channelRepository.getChannels()
            binding.loadingLayout.visibility = View.GONE

            if (channels.isNotEmpty()) {
                allChannels = channels
                categories = cats

                binding.tvTotalChannels.text = "${channels.size} kênh"
                categoryAdapter.submitList(categories)
                channelAdapter.submitList(channels)

                // Publish VTV1..VTV10 channels to Android TV Home Screen
                TvHomeScreenManager.publishVtvChannels(this@MainActivity, channels)

                // If launched from Home Screen card deep link, auto-select that channel
                var autoPlayed = false
                val pending = pendingChannelTarget
                if (!pending.isNullOrBlank()) {
                    autoPlayed = selectAndPlayChannelTarget(pending)
                }

                if (!autoPlayed) {
                    currentChannelIndex = 0
                    playChannel(allChannels[0])
                }
            } else {
                Toast.makeText(this@MainActivity, R.string.no_channels, Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun playChannel(channel: Channel) {
        channelAdapter.setActiveChannel(channel)
        playerManager?.playChannel(channel)
        showChannelInfoOsd(channel)

        // Handle music channel visualizer
        if (channel.isMusic) {
            binding.musicVisualizer.visibility = View.VISIBLE
            binding.tvMusicTitle.text = channel.cleanName
            binding.ivVinyl.startAnimation(vinylAnimation)
        } else {
            binding.musicVisualizer.visibility = View.GONE
            binding.ivVinyl.clearAnimation()
        }
    }

    private fun showChannelInfoOsd(channel: Channel) {
        binding.channelInfoOsd.visibility = View.VISIBLE
        binding.tvOsdNumber.text = String.format("%02d", channel.channelNumber)
        binding.tvOsdName.text = channel.cleanName.ifEmpty { channel.name }
        binding.tvOsdGroup.text = "Nhóm: ${channel.group}"

        if (channel.logo.isNotEmpty()) {
            binding.ivOsdLogo.visibility = View.VISIBLE
            binding.ivOsdLogo.load(channel.logo)
        } else {
            binding.ivOsdLogo.visibility = View.GONE
        }

        osdHideRunnable?.let { handler.removeCallbacks(it) }
        osdHideRunnable = Runnable {
            binding.channelInfoOsd.visibility = View.GONE
        }
        handler.postDelayed(osdHideRunnable!!, 4000)
    }

    private fun onCategorySelected(category: Category) {
        val filteredChannels = if (category.channels.isNotEmpty()) {
            category.channels
        } else {
            allChannels.filter { it.group.equals(category.name, ignoreCase = true) }
        }
        channelAdapter.submitList(filteredChannels)
        binding.rvChannels.scrollToPosition(0)
    }

    private fun onChannelSelected(channel: Channel) {
        val index = allChannels.indexOfFirst { it.id == channel.id }
        if (index != -1) {
            currentChannelIndex = index
            playChannel(allChannels[index])
            hideDrawer()
        }
    }

    private fun toggleDrawer() {
        if (binding.drawerLayout.visibility == View.VISIBLE) {
            hideDrawer()
        } else {
            showDrawer()
        }
    }

    private fun showDrawer() {
        binding.drawerLayout.visibility = View.VISIBLE
        binding.rvChannels.requestFocus()
    }

    private fun hideDrawer() {
        binding.drawerLayout.visibility = View.GONE
    }

    private fun nextChannel() {
        if (allChannels.isEmpty()) return
        currentChannelIndex = (currentChannelIndex + 1) % allChannels.size
        playChannel(allChannels[currentChannelIndex])
    }

    private fun previousChannel() {
        if (allChannels.isEmpty()) return
        currentChannelIndex = if (currentChannelIndex - 1 < 0) allChannels.size - 1 else currentChannelIndex - 1
        playChannel(allChannels[currentChannelIndex])
    }

    private fun handleNumberInput(digit: Int) {
        numberInputBuffer.append(digit)
        binding.tvDigitsOsd.text = numberInputBuffer.toString()
        binding.tvDigitsOsd.visibility = View.VISIBLE

        numberInputRunnable?.let { handler.removeCallbacks(it) }
        numberInputRunnable = Runnable {
            val targetNumber = numberInputBuffer.toString().toIntOrNull()
            numberInputBuffer.clear()
            binding.tvDigitsOsd.visibility = View.GONE

            if (targetNumber != null) {
                val targetChannel = allChannels.find { it.channelNumber == targetNumber }
                if (targetChannel != null) {
                    val index = allChannels.indexOf(targetChannel)
                    if (index != -1) {
                        currentChannelIndex = index
                        playChannel(targetChannel)
                    }
                } else {
                    Toast.makeText(this@MainActivity, "Kênh số $targetNumber không tồn tại", Toast.LENGTH_SHORT).show()
                }
            }
        }
        handler.postDelayed(numberInputRunnable!!, 1500)
    }

    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        // TV Remote Navigation
        when (keyCode) {
            KeyEvent.KEYCODE_DPAD_UP -> {
                if (binding.drawerLayout.visibility != View.VISIBLE) {
                    previousChannel()
                    return true
                }
            }
            KeyEvent.KEYCODE_DPAD_DOWN -> {
                if (binding.drawerLayout.visibility != View.VISIBLE) {
                    nextChannel()
                    return true
                }
            }
            KeyEvent.KEYCODE_DPAD_CENTER, KeyEvent.KEYCODE_ENTER -> {
                if (binding.drawerLayout.visibility != View.VISIBLE) {
                    toggleDrawer()
                    return true
                }
            }
            KeyEvent.KEYCODE_DPAD_LEFT -> {
                if (binding.drawerLayout.visibility != View.VISIBLE) {
                    showDrawer()
                    return true
                }
            }
            KeyEvent.KEYCODE_CHANNEL_UP -> {
                nextChannel()
                return true
            }
            KeyEvent.KEYCODE_CHANNEL_DOWN -> {
                previousChannel()
                return true
            }
            in KeyEvent.KEYCODE_0..KeyEvent.KEYCODE_9 -> {
                val digit = keyCode - KeyEvent.KEYCODE_0
                handleNumberInput(digit)
                return true
            }
            KeyEvent.KEYCODE_BACK -> {
                if (binding.drawerLayout.visibility == View.VISIBLE) {
                    hideDrawer()
                    return true
                }
                val currentTime = System.currentTimeMillis()
                if (currentTime - lastBackPressTime < 2000) {
                    finish()
                } else {
                    lastBackPressTime = currentTime
                    Toast.makeText(this, R.string.press_again_to_exit, Toast.LENGTH_SHORT).show()
                }
                return true
            }
        }
        return super.onKeyDown(keyCode, event)
    }

    override fun onDestroy() {
        super.onDestroy()
        playerManager?.release()
        osdHideRunnable?.let { handler.removeCallbacks(it) }
        numberInputRunnable?.let { handler.removeCallbacks(it) }
    }
}
