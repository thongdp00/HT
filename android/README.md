# HT TV - Android & Android TV App (Kotlin)

Mã nguồn ứng dụng **HT TV** viết bằng **Kotlin** dành cho **Android TV, Android TV Box, Smart TV và Thiết bị Di Động / Máy Tính Bảng**.

---

## 📺 Tính năng chính

- **Hỗ trợ tối ưu Android TV & Mobile:**
  - Nhận diện remote TV (D-Pad): Phím Lên/Xuống chuyển kênh, phím OK/Enter bật danh sách kênh, phím Trái mở danh mục.
  - Hỗ trợ nhập số kênh trực tiếp từ Remote (bàn phím số 0-9) với OSD hiển thị to rõ, tự động chuyển kênh sau 1.5 giây.
  - Phím Back: Đóng danh sách kênh hoặc nhấn 2 lần để thoát ứng dụng.
- **Tích hợp kênh Home Screen Android TV & Google TV (VTV1 đến VTV10):**
  - Hiển thị hàng kênh xem trước (Preview Channels Row) mang tên **"Kênh VTV - HT TV"** ngay tại màn hình chính Home Screen của Android TV / Google TV.
  - Tự động quét và đọc đúng tên kênh thực tế (`cleanName`) và URL logo chính thức từ các card trong danh sách kênh của HT TV.
  - Hỗ trợ cơ chế **Deep Linking** (`httv://channel/vtv1` đến `vtv10`): Khi bấm vào bất kỳ thẻ kênh VTV nào từ màn hình chính Home Screen, ứng dụng sẽ khởi động và tự động phát ngay kênh đó.
  - Tự động đồng bộ và làm mới danh sách kênh khi ứng dụng khởi động (`INITIALIZE_PROGRAMS` hoặc `BOOT_COMPLETED`).
- **Engine phát video Google Media3 (ExoPlayer):**
  - Tương thích đa định dạng: **HLS** (`.m3u8`), **MPEG-DASH** (`.mpd`), **MPEG-TS** (`.ts`).
  - Hỗ trợ giải mã bản quyền số **ClearKey DRM** trực tiếp trên thiết bị.
  - Tự động thay đổi User-Agent và vượt qua các giới hạn kết nối IPTV thể thao.
  - Cơ chế tự phục hồi (Watchdog): tự động thử nguồn phát phụ (`backupUrls`) khi luồng chính bị gián đoạn.
- **Cơ chế nạp kênh 3 lớp:**
  1. Gọi API máy chủ nội bộ (`/api/channels`).
  2. Đồng bộ tự động từ nguồn upstream GitHub Raw.
  3. Dự phòng sẵn tập tin `ht-tv.m3u` trong thư mục `assets` giúp ứng dụng luôn mở được kênh ngay cả khi mạng trễ.
- **Giao diện hiện đại:**
  - Menu trượt (Channel Drawer) bán trong suốt phong cách rạp chiếu phim.
  - OSD hiển thị logo, số thứ tự kênh, tên đài và nhãn Trực tiếp.
  - Hiệu ứng đĩa than quay sinh động khi phát các kênh ca nhạc/radio.

---

## 🚀 Hướng dẫn mở và biên dịch trong Android Studio

### 1. Mở dự án
1. Khởi động **Android Studio** (phiên bản Hedgehog, Iguana, Koala hoặc mới hơn).
2. Chọn **Open** (Mở dự án).
3. Chọn thư mục `android/` trong thư mục gốc của repository này.
4. Đợi Android Studio đồng bộ Gradle (Sync Project with Gradle Files).

### 2. Biên dịch file APK
- **Cách 1: Sử dụng giao diện Android Studio**
  - Vào menu **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
  - File APK được tạo tại: `android/app/build/outputs/apk/debug/app-debug.apk`.
- **Cách 2: Sử dụng dòng lệnh (Terminal)**
  ```bash
  cd android
  ./gradlew assembleDebug
  ```

---

## 📲 Hướng dẫn cài đặt lên Android TV / TV Box / Điện thoại

### Cách 1: Cài đặt qua mạng Wi-Fi bằng ADB
1. Bật **Tùy chọn cho nhà phát triển** (Developer Options) và **Gỡ lỗi USB / Gỡ lỗi mạng** (ADB Debugging) trên Android TV.
2. Kết nối tới TV qua địa chỉ IP:
   ```bash
   adb connect <IP_CỦA_TV>:5555
   ```
3. Cài đặt file APK:
   ```bash
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

### Cách 2: Cài đặt bằng USB
1. Sao chép file `app-debug.apk` vào USB.
2. Cắm USB vào Android TV hoặc TV Box.
3. Mở ứng dụng quản lý tập tin trên TV (như X-plore hoặc File Commander) và bấm vào file `.apk` để cài đặt.

---

## 🎮 Hướng dẫn điều khiển bằng Remote TV

| Phím bấm | Hành động |
| :--- | :--- |
| **Phím Lên / Xuống (D-Pad)** | Chuyển kênh kế tiếp / trước đó |
| **Phím OK / Center** | Bật / tắt danh sách kênh (Channel Drawer) |
| **Phím Trái (D-Pad Left)** | Mở nhanh danh sách danh mục kênh |
| **Phím số (0 – 9)** | Nhập số kênh trực tiếp trên màn hình |
| **Phím Back (Quay lại)** | Đóng bảng menu; hoặc bấm 2 lần để thoát ứng dụng |
