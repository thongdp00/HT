package com.httv.tv

import android.app.Application
import com.httv.tv.tv.TvHomeScreenManager

class HTTVApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Proactively publish VTV1..VTV10 channels to Android TV / Google TV Home Screen
        TvHomeScreenManager.publishVtvChannels(this)
    }
}
