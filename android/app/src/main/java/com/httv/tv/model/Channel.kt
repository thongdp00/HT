package com.httv.tv.model

import com.google.gson.annotations.SerializedName

data class Channel(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("cleanName") val cleanName: String = name,
    @SerializedName("logo") val logo: String = "",
    @SerializedName("group") val group: String = "Tổng Hợp",
    @SerializedName("url") var url: String,
    @SerializedName("backupUrls") val backupUrls: List<String> = emptyList(),
    @SerializedName("format") val format: String = "hls",
    @SerializedName("headers") val headers: Map<String, String>? = null,
    @SerializedName("drm") val drm: DrmConfig? = null,
    @SerializedName("channelNumber") var channelNumber: Int = 0,
    @SerializedName("isMusic") val isMusic: Boolean = false
)

data class DrmConfig(
    @SerializedName("type") val type: String = "none",
    @SerializedName("keyId") val keyId: String? = null,
    @SerializedName("key") val key: String? = null,
    @SerializedName("licenseUrl") val licenseUrl: String? = null
)
