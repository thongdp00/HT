package com.httv.tv.tv

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

/**
 * BroadcastReceiver for Android TV events:
 * - android.media.tv.action.INITIALIZE_PROGRAMS
 * - android.intent.action.BOOT_COMPLETED
 */
class TvChannelReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "TvChannelReceiver"
    }

    override fun onReceive(context: Context, intent: Intent?) {
        val action = intent?.action ?: return
        Log.d(TAG, "Received TV broadcast action: $action")

        if (action == "android.media.tv.action.INITIALIZE_PROGRAMS" ||
            action == Intent.ACTION_BOOT_COMPLETED ||
            action == "android.media.tv.action.PREVIEW_PROGRAM_BROWSABLE_DISABLED"
        ) {
            TvHomeScreenManager.publishVtvChannels(context)
        }
    }
}
