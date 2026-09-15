package com.httv.tv.data

import android.content.Context
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.httv.tv.model.Category
import com.httv.tv.model.Channel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.InputStreamReader
import java.util.concurrent.TimeUnit

class ChannelRepository(private val context: Context) {

    private val client = OkHttpClient.Builder()
        .connectTimeout(5, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .build()

    private val gson = Gson()

    suspend fun getChannels(serverBaseUrl: String? = null): Pair<List<Channel>, List<Category>> = withContext(Dispatchers.IO) {
        // Step 1: Try server API if base URL provided
        if (!serverBaseUrl.isNullOrEmpty()) {
            try {
                val apiUrl = if (serverBaseUrl.endsWith("/")) "${serverBaseUrl}api/channels" else "$serverBaseUrl/api/channels"
                val request = Request.Builder().url(apiUrl).build()
                client.newCall(request).execute().use { response ->
                    if (response.isSuccessful) {
                        val body = response.body?.string()
                        if (!body.isNullOrEmpty()) {
                            val type = object : TypeToken<ApiResponse>() {}.type
                            val res: ApiResponse = gson.fromJson(body, type)
                            if (res.channels.isNotEmpty()) {
                                var num = 1
                                res.channels.forEach { it.channelNumber = num++ }
                                return@withContext Pair(res.channels, res.categories)
                            }
                        }
                    }
                }
            } catch (e: Exception) {
                // Fallback to next step
            }
        }

        // Step 2: Try remote GitHub Raw M3U URL
        try {
            val remoteM3uUrl = "https://raw.githubusercontent.com/thongdp00/m3u/refs/heads/main/ht-tv.m3u"
            val request = Request.Builder()
                .url(remoteM3uUrl)
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .build()
            client.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    val m3uText = response.body?.string()
                    if (!m3uText.isNullOrEmpty()) {
                        return@withContext M3uParser.parse(m3uText)
                    }
                }
            }
        } catch (e: Exception) {
            // Fallback to local asset
        }

        // Step 3: Fallback to embedded ht-tv.m3u asset
        try {
            context.assets.open("ht-tv.m3u").use { inputStream ->
                val content = InputStreamReader(inputStream).readText()
                return@withContext M3uParser.parse(content)
            }
        } catch (e: Exception) {
            return@withContext Pair(emptyList(), emptyList())
        }
    }

    private data class ApiResponse(
        val channels: List<Channel> = emptyList(),
        val categories: List<Category> = emptyList()
    )
}
