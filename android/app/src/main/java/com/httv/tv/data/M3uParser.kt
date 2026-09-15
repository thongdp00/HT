package com.httv.tv.data

import com.httv.tv.model.Category
import com.httv.tv.model.Channel
import com.httv.tv.model.DrmConfig

object M3uParser {

    private val GROUP_PRIORITY = listOf(
        "VTV",
        "HTV",
        "VTVcab",
        "SCTV",
        "Sự Kiện TV360",
        "Thể Thao Quốc Tế",
        "Phim Truyện",
        "Quốc Tế",
        "Địa Phương",
        "Thiếu Nhi",
        "Khoa Giáo",
        "Nghe Nhạc",
        "Tổng Hợp"
    )

    fun parse(m3uContent: String): Pair<List<Channel>, List<Category>> {
        val channels = mutableListOf<Channel>()
        val lines = m3uContent.lines()

        var currentExtInf: String? = null
        val currentHeaders = mutableMapOf<String, String>()
        var currentDrm: DrmConfig? = null

        val extInfRegex = Regex("""#EXTINF:-?\d+\s*(.*?),(.*)""")
        val tvgLogoRegex = Regex("""tvg-logo="([^"]*)"""")
        val groupTitleRegex = Regex("""group-title="([^"]*)"""")
        val tvgNameRegex = Regex("""tvg-name="([^"]*)"""")
        val tvgIdRegex = Regex("""tvg-id="([^"]*)"""")

        for (rawLine in lines) {
            val line = rawLine.trim()
            if (line.isEmpty()) continue

            if (line.startsWith("#EXTINF")) {
                currentExtInf = line
                currentHeaders.clear()
                currentDrm = null
            } else if (line.startsWith("#EXTVLCOPT:http-user-agent=")) {
                val ua = line.substringAfter("=").trim()
                currentHeaders["User-Agent"] = ua
            } else if (line.startsWith("#EXTVLCOPT:http-referrer=") || line.startsWith("#EXTVLCOPT:http-referer=")) {
                val ref = line.substringAfter("=").trim()
                currentHeaders["Referer"] = ref
            } else if (line.startsWith("#KODIPROP:inputstream.adaptive.license_key=")) {
                val key = line.substringAfter("=").trim()
                currentDrm = DrmConfig(type = "clearkey", key = key)
            } else if (!line.startsWith("#") && currentExtInf != null) {
                // This is the stream URL
                val match = extInfRegex.find(currentExtInf)
                val attributes = match?.groupValues?.get(1) ?: ""
                val channelName = match?.groupValues?.get(2)?.trim() ?: "Kênh"

                val logo = tvgLogoRegex.find(attributes)?.groupValues?.get(1) ?: ""
                val group = groupTitleRegex.find(attributes)?.groupValues?.get(1) ?: "Tổng Hợp"
                val tvgId = tvgIdRegex.find(attributes)?.groupValues?.get(1) ?: "ch_${channels.size + 1}"

                val lowerUrl = line.lowercase()
                val format = when {
                    lowerUrl.contains(".mpd") -> "dash"
                    lowerUrl.contains(".m3u8") -> "hls"
                    lowerUrl.contains(".ts") || lowerUrl.contains("extension=ts") || lowerUrl.contains("/live/") -> "ts"
                    else -> "hls"
                }

                val isMusic = group.contains("Nhạc") || channelName.contains("Music", ignoreCase = true)

                val channel = Channel(
                    id = tvgId,
                    name = channelName,
                    cleanName = channelName,
                    logo = logo,
                    group = group,
                    url = line,
                    format = format,
                    headers = if (currentHeaders.isNotEmpty()) currentHeaders.toMap() else null,
                    drm = currentDrm,
                    isMusic = isMusic
                )
                channels.add(channel)
                currentExtInf = null
            }
        }

        // Group channels into categories and assign sequential channel numbers
        val categoryMap = mutableMapOf<String, MutableList<Channel>>()
        GROUP_PRIORITY.forEach { categoryMap[it] = mutableListOf() }

        channels.forEach { ch ->
            val list = categoryMap.getOrPut(ch.group) { mutableListOf() }
            list.add(ch)
        }

        val categories = mutableListOf<Category>()
        var number = 1

        GROUP_PRIORITY.forEach { groupName ->
            val groupChannels = categoryMap[groupName]
            if (!groupChannels.isNullOrEmpty()) {
                groupChannels.forEach { ch ->
                    ch.channelNumber = number++
                }
                categories.add(
                    Category(
                        id = groupName.lowercase().replace(" ", "_"),
                        name = groupName,
                        channels = groupChannels
                    )
                )
            }
        }

        // Add any remaining groups not in priority list
        categoryMap.forEach { (groupName, groupChannels) ->
            if (groupName !in GROUP_PRIORITY && groupChannels.isNotEmpty()) {
                groupChannels.forEach { ch ->
                    ch.channelNumber = number++
                }
                categories.add(
                    Category(
                        id = groupName.lowercase().replace(" ", "_"),
                        name = groupName,
                        channels = groupChannels
                    )
                )
            }
        }

        val allNumberedChannels = categories.flatMap { it.channels }
        return Pair(allNumberedChannels, categories)
    }
}
