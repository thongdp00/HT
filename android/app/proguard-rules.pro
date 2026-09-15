# Proguard rules for HT TV
-keep class com.httv.tv.model.** { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}
-keep class androidx.media3.** { *; }
-dontwarn androidx.media3.**
-dontwarn okhttp3.**
