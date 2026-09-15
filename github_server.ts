import express from "express";
import path from "path";
import cors from "cors";
import http from "http";
import https from "https";
import { URL } from "url";
import { Readable, PassThrough } from "stream";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Custom HTTP/HTTPS agents with rejectUnauthorized: false for international sports streams
// Set keepAlive: false so connections are immediately closed and not kept idling on Xtream Codes servers
const sportsHttpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: false,
  maxSockets: 64,
});
const sportsHttpAgent = new http.Agent({
  keepAlive: false,
  maxSockets: 64,
});

// Domain keywords for Thể Thao Quốc Tế & Xtream Codes
const INTERNATIONAL_SPORTS_DOMAINS = [
  "tharen1",
  "terranovax1",
  "antik.sk",
  "royallivetv",
  "royallivetv.club",
  ".cfd",
  ".club",
  "zalmora",
  "panaka",
  "jarvisx",
  "thobias",
  "livesport.io.vn",
  "smartvnow.xyz",
  "apolonbox",
  "watchtivo",
  "ifiesta.net",
  "zazaint.com",
  "aynaott.com",
  "amagi.tv",
];

// Main M3U source URLs
const PRIMARY_HT_TV_URL = "https://raw.githubusercontent.com/thongdp00/m3u/refs/heads/main/ht-tv.m3u";
const UPSTREAM_VIETANHTV_URL = "https://tv.vietanhtv.top/sex/";

function isTokenExpired(url: string, bufferSeconds = 15): boolean {
  if (!url) return false;
  try {
    const match = url.match(/[?&](?:expires|expire|exp)=(\d+)/i);
    if (!match) return false;
    const expiresTimestamp = parseInt(match[1], 10);
    if (isNaN(expiresTimestamp)) return false;
    const currentUnix = Math.floor(Date.now() / 1000);
    return expiresTimestamp <= currentUnix + bufferSeconds;
  } catch {
    return false;
  }
}

function isSpecialTv360Channel(name: string, url: string): boolean {
  const n = (name || "").toLowerCase();
  const u = (url || "").toLowerCase();
  return (
    n.includes("on phim việt") ||
    n.includes("on phim viet") ||
    n.includes("phim việt") ||
    n === "hitv" ||
    n.includes("hitv") ||
    n.includes("you tv") ||
    n.includes("youtv") ||
    u.includes("id=175") ||
    u.includes("id=32") ||
    u.includes("id=31") ||
    u.includes("348.m3u8") ||
    u.includes("332.m3u8") ||
    u.includes("/447/output")
  );
}

function scoreStreamUrl(url: string, cleanName: string = ""): number {
  if (!url) return -9999;
  let score = 100;

  const lowerUrl = url.toLowerCase();

  // 1. Kiểm tra token hết hạn -> Loại bỏ
  if (isTokenExpired(url)) {
    return -9000;
  }

  // 2. Token còn hạn hợp lệ -> Điểm cộng lớn
  if (lowerUrl.includes("token=") || lowerUrl.includes("expires=")) {
    score += 150;
  }

  // 3. Ưu tiên các CDN chính thức tốc độ cao & ổn định nhất tại Việt Nam
  if (lowerUrl.includes("tv360.php") || lowerUrl.includes("tv360.vn") || lowerUrl.includes("vietanhtv.top/tv360")) {
    score += 300;
  } else if (lowerUrl.includes("vieon.php") || lowerUrl.includes("vieon.vn")) {
    score += 280;
  } else if (lowerUrl.includes("vtvgo") || lowerUrl.includes("vtv.vn")) {
    score += 260;
  } else if (lowerUrl.includes("vtvcab") || lowerUrl.includes("onplus")) {
    score += 250;
  } else if (lowerUrl.includes("sctv") || lowerUrl.includes("htv")) {
    score += 240;
  }

  // 4. Thể thao quốc tế: Ưu tiên link VIP trực tiếp, ổn định
  if (lowerUrl.includes("livesport.io.vn/ok/vip1.php")) {
    score += 200;
  } else if (lowerUrl.includes("livesport.io.vn/ok/stalkvip.php")) {
    score += 50;
  }

  // 5. Loại bỏ / trừ điểm nặng các nguồn dự phòng chậm, lỗi hoặc domain không ổn định
  if (
    lowerUrl.includes("watchtivo-8k.com") ||
    lowerUrl.includes("aynaott.com") ||
    lowerUrl.includes("short.gy") ||
    lowerUrl.includes("tivi-one-iptv.net")
  ) {
    score -= 400;
  }

  // 6. Ưu tiên giao thức HTTPS bảo mật & không bị Mixed Content
  if (lowerUrl.startsWith("https://")) {
    score += 40;
  }

  // 7. Ưu tiên định dạng HLS/DASH tiêu chuẩn
  if (lowerUrl.includes(".m3u8") || lowerUrl.includes(".mpd")) {
    score += 30;
  }

  return score;
}

function selectBestStreamUrl(urls: string[], cleanName: string = ""): string {
  if (!urls || urls.length === 0) return "";
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));
  if (uniqueUrls.length === 1) return uniqueUrls[0];

  let bestUrl = uniqueUrls[0];
  let bestScore = scoreStreamUrl(bestUrl, cleanName);

  for (let i = 1; i < uniqueUrls.length; i++) {
    const s = scoreStreamUrl(uniqueUrls[i], cleanName);
    if (s > bestScore) {
      bestScore = s;
      bestUrl = uniqueUrls[i];
    }
  }

  return bestUrl;
}

// Cache container with 2-minute TTL
let cachedData: {
  timestamp: number;
  channels: any[];
  categories: any[];
  m3uText: string;
} | null = null;

const CACHE_TTL_MS = 120 * 1000; // 2 minutes

function cleanChannelName(rawName: string): string {
  if (!rawName) return "Kênh TV";
  let cleaned = rawName
    .replace(/VTVcab\s*MPD\s*DRM/gi, "")
    .replace(/MPD\s*DRM/gi, "")
    .replace(/\[\s*DRM\s*\]/gi, "")
    .replace(/\(\s*DRM\s*\)/gi, "")
    .replace(/\[\s*MPD\s*\]/gi, "")
    .replace(/\(\s*MPD\s*\)/gi, "")
    .replace(/-\s*DRM/gi, "")
    .replace(/\|\s*DRM/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Chuẩn hóa tên kênh UNITE8 SPORT 1B thành UNITE8 SPORT 1
  if (/^UNITE\s*8\s*SPORT\s*1\s*B?$/i.test(cleaned)) {
    cleaned = "UNITE8 SPORT 1";
  } else if (/^UNITE\s*8\s*SPORT\s*2$/i.test(cleaned)) {
    cleaned = "UNITE8 SPORT 2";
  }

  return cleaned || rawName.trim();
}

function upgradeStreamUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("https://") || trimmed.startsWith("//") || trimmed.startsWith("/")) {
    return trimmed;
  }
  if (trimmed.startsWith("http://")) {
    const lower = trimmed.toLowerCase();
    if (
      lower.includes("vietanhtv.top") ||
      lower.includes("vietanhtv.id.vn") ||
      lower.includes("seenow.vn") ||
      lower.includes("mytvnet.vn") ||
      lower.includes("vtvprime.vn") ||
      lower.includes("vtvgo.vn") ||
      lower.includes("vieon.vn") ||
      lower.includes("freem3u.xyz") ||
      lower.includes("githubusercontent.com")
    ) {
      return trimmed.replace(/^http:\/\//i, "https://");
    }
  }
  return trimmed;
}

function isThirdPartyApiUrl(url?: string | null): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("freem3u.xyz") ||
    lower.includes("vmttv.dpdns.org") ||
    lower.includes("?vid=") ||
    lower.includes("&vid=") ||
    lower.includes("?id=") ||
    lower.includes("&id=")
  );
}

function parseM3USource(content: string, sourceOrigin: "ht-tv" | "vietanhtv"): any[] {
  const lines = content.split(/\r?\n/);
  const channels: any[] = [];

  let curTvgId = "";
  let curTvgName = "";
  let curTvgLogo = "";
  let curRawGroup = "";
  let curRawName = "";
  let licenseType = "none";
  let licenseKey = "";
  let licenseUrl = "";
  let customHeaders: Record<string, string> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Kodi DRM properties
    if (line.startsWith("#KODIPROP:")) {
      const prop = line.substring("#KODIPROP:".length);
      const eqIdx = prop.indexOf("=");
      if (eqIdx !== -1) {
        const key = prop.substring(0, eqIdx).trim();
        const value = prop.substring(eqIdx + 1).trim();
        if (key.includes("license_type")) {
          if (value.toLowerCase().includes("clearkey") || value.toLowerCase().includes("org.w3.clearkey")) {
            licenseType = "clearkey";
          } else if (value.toLowerCase().includes("widevine") || value.toLowerCase().includes("com.widevine.alpha")) {
            licenseType = "widevine";
          }
        } else if (key.includes("license_key")) {
          if (value.startsWith("http")) {
            licenseUrl = value;
          } else {
            licenseKey = value;
          }
        }
      }
      continue;
    }

    // VLC / HTTP Headers
    if (line.startsWith("#EXTVLCOPT:http-user-agent=")) {
      customHeaders["User-Agent"] = line.substring("#EXTVLCOPT:http-user-agent=".length).trim();
      continue;
    }
    if (line.startsWith("#EXTVLCOPT:http-referrer=") || line.startsWith("#EXTVLCOPT:http-referer=")) {
      customHeaders["Referer"] = line.split("=")[1].trim();
      continue;
    }

    // EXTINF Metadata
    if (line.startsWith("#EXTINF:")) {
      const infoLine = line.substring("#EXTINF:".length);
      const commaIdx = infoLine.lastIndexOf(",");
      curRawName = commaIdx !== -1 ? infoLine.substring(commaIdx + 1).trim() : "Kênh TV";

      const getAttr = (attr: string) => {
        const match = infoLine.match(new RegExp(`${attr}=(?:"(?:\\s*${attr}=)*"|")([^"]+)"`, "i")) ||
                      infoLine.match(new RegExp(`${attr}="([^"]*)"`, "i"));
        return match ? match[1].trim() : "";
      };

      curTvgId = getAttr("tvg-id");
      curTvgName = getAttr("tvg-name") || curRawName;
      let rawLogo = getAttr("tvg-logo") || getAttr("logo") || "";
      if (rawLogo.includes("http")) {
        const httpMatch = rawLogo.match(/(https?:\/\/[^\s"']+)/i);
        if (httpMatch) rawLogo = httpMatch[1];
      }
      curTvgLogo = rawLogo;
      curRawGroup = getAttr("group-title") || getAttr("group") || "";
      continue;
    }

      // Stream URL
    if (!line.startsWith("#") && (line.startsWith("http://") || line.startsWith("https://") || line.startsWith("/"))) {
      let streamUrl = upgradeStreamUrl(line);
      const cleanName = cleanChannelName(curRawName || curTvgName);
      const normGroup = curRawGroup.normalize("NFC").toLowerCase();
      const normName = cleanName.normalize("NFC").toLowerCase();
      const lowerRawName = (curRawName || "").toLowerCase();
      const lowerRawGroup = (curRawGroup || "").toLowerCase();

      // Tách đúng ID luồng trong Playlist M3U: UNITE8 SPORT 1 (id=uni1) và UNITE8 SPORT 2 (id=uni2)
      if (
        normName.includes("unite8 sport 1") ||
        normName.includes("unite 8 sport 1") ||
        lowerRawName.includes("unite8 sport 1") ||
        lowerRawName.includes("unite 8 sport 1")
      ) {
        if (streamUrl.includes("id=uni2")) {
          streamUrl = streamUrl.replace("id=uni2", "id=uni1");
        }
      } else if (
        normName.includes("unite8 sport 2") ||
        normName.includes("unite 8 sport 2") ||
        lowerRawName.includes("unite8 sport 2") ||
        lowerRawName.includes("unite 8 sport 2")
      ) {
        if (streamUrl.includes("id=uni1")) {
          streamUrl = streamUrl.replace("id=uni1", "id=uni2");
        }
      }
      const lowerUrl = streamUrl.toLowerCase();

      // SCTV channels must NEVER be filtered out
      const isSctv =
        normName.includes("sctv") ||
        normGroup.includes("sctv") ||
        lowerRawName.includes("sctv") ||
        lowerRawGroup.includes("sctv");

      // Strictly remove and exclude any VTVPrime event channels (only by group-title or channel name)
      // Never filter by streamUrl, as SCTV streams use the vtvprime.vn CDN domain!
      const isVtvPrime =
        !isSctv &&
        (
          normGroup.includes("sự kiện vtvprime") ||
          normGroup.includes("su kien vtvprime") ||
          normGroup.includes("vtvprime") ||
          normName.includes("vtvprime") ||
          lowerRawName.includes("vtvprime") ||
          lowerRawGroup.includes("vtvprime")
        );

      if (isVtvPrime) {
        curTvgId = "";
        curTvgName = "";
        curTvgLogo = "";
        curRawGroup = "";
        curRawName = "";
        licenseType = "none";
        licenseKey = "";
        licenseUrl = "";
        customHeaders = {};
        continue;
      }

      let targetCategory: string | null = null;

      if (sourceOrigin === "ht-tv") {
        if (normGroup.includes("vtvcab") || normGroup.includes("vtv cab") || normGroup === "vtvcab" || normName.includes("vtvcab")) {
          targetCategory = "VTVCab";
        } else if (normGroup === "vtv" || (normGroup.includes("vtv") && !normGroup.includes("cab"))) {
          targetCategory = "VTV";
        } else if (normGroup === "htv" || normGroup.includes("htv")) {
          targetCategory = "HTV";
        } else if (normGroup === "sctv" || normGroup.includes("sctv")) {
          targetCategory = "SCTV";
        } else if (normGroup.includes("thể thao") || normGroup.includes("the thao") || normGroup.includes("sport")) {
          targetCategory = "Thể Thao Quốc Tế";
        } else if (normGroup.includes("địa phương") || normGroup.includes("dia phuong")) {
          targetCategory = "Địa Phương";
        } else if (normGroup.includes("phim")) {
          targetCategory = "Phim Truyện";
        } else if (normGroup.includes("nhạc") || normGroup.includes("nhac")) {
          targetCategory = "Nghe Nhạc";
        } else if (normGroup.includes("quốc tế") || normGroup.includes("quoc te")) {
          targetCategory = "Quốc Tế";
        }
      } else if (sourceOrigin === "vietanhtv") {
        // TV360 Event channels from vietanhtv (strictly exclude VTVPrime)
        if (
          !isVtvPrime &&
          (normGroup.includes("tv360") ||
          normGroup.includes("sự kiện") ||
          normGroup.includes("su kien") ||
          normGroup.includes("event") ||
          normName.includes("tv360"))
        ) {
          targetCategory = "Sự Kiện TV360";
        }
      }

      if (targetCategory) {
        const isSpecialHls = isSpecialTv360Channel(cleanName, streamUrl);

        let drmInfo: any = undefined;
        if (!isSpecialHls) {
          const upgradedLicenseUrl = licenseUrl ? upgradeStreamUrl(licenseUrl) : "";
          if (licenseType !== "none" || licenseKey || upgradedLicenseUrl) {
            drmInfo = {
              type: licenseType !== "none" ? licenseType : "clearkey",
              licenseUrl: upgradedLicenseUrl || undefined,
              key: licenseKey || undefined
            };
          }
        }

        const isMusic = targetCategory === "Nghe Nhạc" && !normName.includes("on music") && !normName.includes("htvc ca nhạc");
        
        let format: "hls" | "dash" | "ts" = "hls";
        if (isSpecialHls) {
          // Standardize ON Phim Việt, HiTV, and You TV to HLS, completely eliminate DRM
          format = "hls";
          drmInfo = undefined;
          customHeaders = {
            "User-Agent": "Dalvik/2.1.0",
            "Referer": "https://tv360.vn/",
            "Origin": "https://tv360.vn"
          };
        } else {
          const isHls = lowerUrl.includes(".m3u8") || lowerUrl.includes("/vieon/vieon.php") || lowerUrl.includes("chunklist") || lowerUrl.includes("hls") || lowerUrl.includes("hls_clean");
          const isTv360Event = targetCategory === "Sự Kiện TV360" || cleanName.toUpperCase().includes("TV360+") || lowerUrl.includes("live_dashdrm");
          const isDash = !isHls && (lowerUrl.includes(".mpd") || lowerUrl.includes("dash") || (isTv360Event && !!drmInfo) || lowerUrl.includes("seenow.vn") || lowerUrl.includes("mytvnet.vn"));
          const isTs = !isDash && !isHls && (lowerUrl.includes(".ts") || lowerUrl.includes("extension=ts") || lowerUrl.includes("mac=") || lowerUrl.includes("play_token=") || lowerUrl.includes("/play/live.php") || lowerUrl.includes("ifiesta.net") || lowerUrl.includes("zazaint.com") || lowerUrl.includes("watchtivo") || lowerUrl.includes("tivi-one-iptv") || lowerUrl.includes(":80/") || lowerUrl.includes(":8080/"));
          format = isDash ? "dash" : isTs ? "ts" : "hls";
          if (targetCategory === "Sự Kiện TV360" || cleanName.toUpperCase().includes("TV360+")) {
            customHeaders = {
              "User-Agent": "Dalvik/2.1.0",
              "Referer": "https://tv360.vn/",
              "Origin": "https://tv360.vn"
            };
          } else if (lowerUrl.includes("mac=") || lowerUrl.includes("play_token=")) {
            customHeaders = {
              "User-Agent": "Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3",
              "Accept": "*/*",
            };
          }
        }

        const lowerClean = cleanName.toLowerCase();
        const isDualSource =
          lowerClean.includes("on phim việt") ||
          lowerClean.includes("on phim viet") ||
          (lowerClean.includes("phim việt") && !lowerClean.includes("vtv")) ||
          lowerClean === "hitv" ||
          lowerClean.includes("hitv") ||
          targetCategory === "Thể Thao Quốc Tế" ||
          targetCategory.toLowerCase().includes("thể thao quốc tế") ||
          /tv360\s*\+\s*([1-9]|1[0-5])\b/i.test(lowerClean) ||
          cleanName.toUpperCase().includes("TV360+") ||
          targetCategory === "Sự Kiện TV360" ||
          targetCategory === "Sự Kiện" ||
          streamUrl.toLowerCase().includes("tv360") ||
          streamUrl.toLowerCase().includes("vietanhtv") ||
          streamUrl.toLowerCase().includes("/447/output") ||
          streamUrl.toLowerCase().includes("348.m3u8");

        const cleanDirectUrl = streamUrl.replace(/^.*\/api\/(?:stream-)?proxy\?url=([^&]+).*$/, (_, enc) => decodeURIComponent(enc));
        const isThirdPartyApi = isThirdPartyApiUrl(streamUrl) || isThirdPartyApiUrl(cleanDirectUrl);

        const isDomestic =
          !isDualSource &&
          !isThirdPartyApi &&
          (targetCategory === "VTV" ||
          targetCategory === "HTV" ||
          targetCategory === "SCTV" ||
          targetCategory === "VTVCab" ||
          targetCategory === "Địa Phương" ||
          targetCategory === "Phim Truyện" ||
          targetCategory === "Nghe Nhạc" ||
          cleanName.toLowerCase().startsWith("vtv") ||
          cleanName.toLowerCase().startsWith("htv") ||
          cleanName.toLowerCase().startsWith("sctv") ||
          cleanName.toLowerCase().startsWith("thvl"));

        let proxyParams = "";
        if (
          lowerClean.includes("on phim việt") ||
          lowerClean.includes("on phim viet") ||
          lowerClean.includes("phim việt") ||
          lowerClean.includes("hitv") ||
          /tv360\s*\+\s*([1-9]|1[0-5])\b/i.test(lowerClean) ||
          cleanName.toUpperCase().includes("TV360+") ||
          targetCategory === "Sự Kiện TV360" ||
          targetCategory === "Sự Kiện" ||
          cleanDirectUrl.toLowerCase().includes("tv360") ||
          cleanDirectUrl.toLowerCase().includes("vietanhtv")
        ) {
          proxyParams = "&ua=Dalvik%2F2.1.0&referer=https%3A%2F%2Ftv360.vn%2F";
        } else if (targetCategory === "Thể Thao Quốc Tế" || targetCategory.toLowerCase().includes("thể thao quốc tế")) {
          if (cleanDirectUrl.includes("livesport")) {
            proxyParams = `&ua=${encodeURIComponent("IPTVSmartersPro/3.1.5.1 (Linux; Android 10)")}&isLivesport=1`;
          } else if (cleanDirectUrl.includes("mac=") || cleanDirectUrl.includes("play_token=")) {
            proxyParams = `&ua=${encodeURIComponent("Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3")}`;
          } else if (cleanDirectUrl.includes("zazaint.com") || cleanDirectUrl.includes("extension=ts")) {
            proxyParams = "&ua=IPTVSmartersPlayer";
          } else {
            proxyParams = "&isSports=1";
          }
        }
        const proxyUrl = `/api/stream-proxy?url=${encodeURIComponent(cleanDirectUrl)}${proxyParams}`;
        const thirdPartyProxyUrl = `/api/proxy?url=${encodeURIComponent(cleanDirectUrl)}&ua=${encodeURIComponent(customHeaders["User-Agent"] || "Dalvik/2.1.0")}&referer=https%3A%2F%2Ftv360.vn%2F`;

        const effectiveUrl = isThirdPartyApi ? thirdPartyProxyUrl : (isDualSource ? proxyUrl : (isDomestic ? cleanDirectUrl : streamUrl));
        const effectiveUrls = isThirdPartyApi ? [thirdPartyProxyUrl] : (isDualSource ? [proxyUrl, cleanDirectUrl] : [effectiveUrl]);
        const effectiveBackups = isThirdPartyApi ? [] : (isDualSource ? [cleanDirectUrl] : []);

        const isThp3 =
          normName.includes("thp3") ||
          normName.includes("thp 3") ||
          lowerRawName.includes("thp3") ||
          lowerRawName.includes("thp 3") ||
          (normName.includes("hải phòng") && (normName.includes("3") || normName.includes("plus"))) ||
          (lowerRawName.includes("hải phòng") && (lowerRawName.includes("3") || lowerRawName.includes("plus")));

        const finalLogo = isThp3
          ? "https://raw.githubusercontent.com/vuminhthanh12/Logo/refs/heads/main/THP3.png"
          : curTvgLogo;

        const newCh = {
          id: `ch_${targetCategory.toLowerCase().replace(/\s+/g, "_")}_${channels.length + 1}_${Math.floor(Math.random() * 1000)}`,
          name: curRawName,
          cleanName,
          logo: finalLogo,
          group: targetCategory,
          url: effectiveUrl,
          urls: effectiveUrls,
          backupUrls: effectiveBackups,
          format,
          drm: isSpecialHls ? undefined : (format === "dash" ? drmInfo : undefined),
          headers: Object.keys(customHeaders).length > 0 ? customHeaders : undefined,
          isMusic
        };

        // Lọc và giữ lại nguồn chất lượng tốt nhất, loại bỏ trùng lặp hoặc dự phòng lỗi
        const existingIndex = channels.findIndex(
          (c) => c.cleanName.toLowerCase() === newCh.cleanName.toLowerCase() && c.group === newCh.group
        );

        if (existingIndex >= 0) {
          const existing = channels[existingIndex];
          if (isThirdPartyApi) {
            channels[existingIndex] = {
              ...newCh,
              url: thirdPartyProxyUrl,
              urls: [thirdPartyProxyUrl],
              backupUrls: []
            };
          } else if (isDualSource) {
            channels[existingIndex] = {
              ...newCh,
              url: proxyUrl,
              urls: [proxyUrl, cleanDirectUrl],
              backupUrls: [cleanDirectUrl]
            };
          } else {
            const bestUrl = selectBestStreamUrl([existing.url, newCh.url], newCh.cleanName);
            const finalUrl = isDomestic ? bestUrl.replace(/^.*\/api\/(?:stream-)?proxy\?url=([^&]+).*$/, (_, enc) => decodeURIComponent(enc)) : bestUrl;
            if (bestUrl === newCh.url) {
              channels[existingIndex] = {
                ...newCh,
                url: finalUrl,
                urls: [finalUrl],
                backupUrls: []
              };
            } else {
              channels[existingIndex].url = finalUrl;
              channels[existingIndex].urls = [finalUrl];
              channels[existingIndex].backupUrls = [];
            }
          }
        } else {
          channels.push(newCh);
        }
      }

      // Reset state
      curTvgId = "";
      curTvgName = "";
      curTvgLogo = "";
      curRawGroup = "";
      curRawName = "";
      licenseType = "none";
      licenseKey = "";
      licenseUrl = "";
      customHeaders = {};
    }
  }

  return channels;
}

async function fetchPlaylists(force = false): Promise<{ channels: any[]; categories: any[]; m3uText: string }> {
  // Check if cache is valid and contains no expired tokens
  if (!force && cachedData && Date.now() - cachedData.timestamp < CACHE_TTL_MS) {
    const hasExpired = cachedData.channels.some((c) => isTokenExpired(c.url));
    if (!hasExpired) {
      return cachedData;
    }
  }

  try {
    const [res1, res2] = await Promise.all([
      fetch(PRIMARY_HT_TV_URL, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
      }).catch(() => null),
      fetch(`${UPSTREAM_VIETANHTV_URL}?t=${Date.now()}`, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      }).catch(() => null)
    ]);

    let text1 = "";
    if (res1 && res1.ok) {
      text1 = await res1.text();
    }

    let text2 = "";
    if (res2 && res2.ok) {
      text2 = await res2.text();
    }

    const primaryChannels = text1 ? parseM3USource(text1, "ht-tv") : [];
    const freshVietanhChannels = text2 ? parseM3USource(text2, "vietanhtv") : [];

    // Create lookup map of fresh vietanhtv channels by ID parameter and name
    const vietanhtvById = new Map<string, any>();
    const vietanhtvByName = new Map<string, any>();

    const getUrlId = (u: string) => {
      const m = u.match(/[?&]id=([^&]+)/i);
      return m ? m[1].toLowerCase() : "";
    };

    freshVietanhChannels.forEach((ch) => {
      const id = getUrlId(ch.url);
      if (id) vietanhtvById.set(id, ch);
      const cleanKey = ch.cleanName.toLowerCase().replace(/\s+/g, "");
      vietanhtvByName.set(cleanKey, ch);
    });

    // Merge fresh tokens from vietanhtv for any channel that needs fresh tokens or is expired
    primaryChannels.forEach((ch) => {
      ch.backupUrls = [];
      const isSpecial = isSpecialTv360Channel(ch.cleanName || ch.name, ch.url);
      const targetId = getUrlId(ch.url);
      const cleanKey = ch.cleanName.toLowerCase().replace(/\s+/g, "");

      const freshMatch = (targetId && vietanhtvById.get(targetId)) || vietanhtvByName.get(cleanKey);
      if (freshMatch && freshMatch.url && !isTokenExpired(freshMatch.url)) {
        if (isSpecial || isTokenExpired(ch.url) || ch.url.includes("tv360.php") || !ch.url.includes("token=")) {
          ch.url = freshMatch.url;
          if (isSpecial) {
            ch.format = "hls";
            ch.drm = undefined;
            ch.headers = {
              "User-Agent": "Dalvik/2.1.0",
              "Referer": "https://tv360.vn/",
              "Origin": "https://tv360.vn"
            };
          } else {
            if (freshMatch.drm) ch.drm = freshMatch.drm;
            if (freshMatch.headers) ch.headers = freshMatch.headers;
          }
        }
      } else if (isSpecial) {
        ch.format = "hls";
        ch.drm = undefined;
        ch.headers = {
          "User-Agent": "Dalvik/2.1.0",
          "Referer": "https://tv360.vn/",
          "Origin": "https://tv360.vn"
        };
      }
    });

    // Extract fresh TV360 Event channels from vietanhtv
    const tv360EventChannels = freshVietanhChannels
      .filter((c) => c.group === "Sự Kiện TV360")
      .map((c) => ({ ...c, backupUrls: [] }));

    const mergedChannels = [...primaryChannels, ...tv360EventChannels];

    const categoryOrder = [
      "VTV",
      "VTVCab",
      "Sự Kiện TV360",
      "HTV",
      "SCTV",
      "Địa Phương",
      "Thể Thao Quốc Tế",
      "Quốc Tế",
      "Phim Truyện",
      "Nghe Nhạc"
    ];

    const categories: any[] = [];
    const orderedChannels: any[] = [];
    let runningChannelNumber = 1;

    categoryOrder.forEach((catName) => {
      let chs = mergedChannels.filter((c) => c.group === catName);
      if (chs.length > 0) {
        // Sort Thể Thao Quốc Tế, Quốc Tế, Phim Truyện (and Địa Phương) alphabetically A,B,C
        if (
          catName === "Thể Thao Quốc Tế" ||
          catName === "Quốc Tế" ||
          catName === "Phim Truyện" ||
          catName === "Địa Phương"
        ) {
          chs = [...chs].sort((a, b) =>
            a.cleanName.localeCompare(b.cleanName, "vi", { sensitivity: "base", numeric: true })
          );
        }
        chs.forEach((c) => {
          c.channelNumber = runningChannelNumber++;
          if (!c.urls || c.urls.length === 0) {
            c.urls = [c.url];
          }
          if (!c.backupUrls) {
            c.backupUrls = c.urls.length > 1 ? c.urls.slice(1) : [];
          }
          orderedChannels.push(c);
        });
        categories.push({
          id: catName.toLowerCase().replace(/\s+/g, "_"),
          name: catName,
          channels: chs
        });
      }
    });

    // Build unified M3U playlist representation
    let m3uLines = ["#EXTM3U url-tvg=\"https://lichphatsong.io.vn/epg.xml\""];
    orderedChannels.forEach((ch) => {
      let extinf = `#EXTINF:-1 tvg-name="${ch.cleanName}" group-title="${ch.group}"`;
      if (ch.logo) extinf += ` tvg-logo="${ch.logo}"`;
      extinf += `, ${ch.name || ch.cleanName}`;
      m3uLines.push(extinf);

      if (ch.headers?.["User-Agent"]) {
        m3uLines.push(`#EXTVLCOPT:http-user-agent=${ch.headers["User-Agent"]}`);
      }
      if (ch.drm?.type && ch.drm.type !== "none") {
        m3uLines.push(`#KODIPROP:inputstream.adaptive.license_type=${ch.drm.type}`);
        if (ch.drm.licenseUrl) {
          m3uLines.push(`#KODIPROP:inputstream.adaptive.license_key=${ch.drm.licenseUrl}`);
        } else if (ch.drm.key) {
          m3uLines.push(`#KODIPROP:inputstream.adaptive.license_key=${ch.drm.key}`);
        }
      }
      m3uLines.push(ch.url);
    });

    cachedData = {
      timestamp: Date.now(),
      channels: orderedChannels,
      categories,
      m3uText: m3uLines.join("\n")
    };

    return cachedData;
  } catch (err) {
    console.error("Error aggregating playlists:", err);
    if (cachedData) return cachedData;
    return { channels: [], categories: [], m3uText: "#EXTM3U\n" };
  }
}

// API endpoint returning structured JSON channels and categorized groups
app.get("/api/channels", async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === "1" || req.query.refresh === "true";
    const data = await fetchPlaylists(forceRefresh);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to load channels", details: err.message });
  }
});

// Dedicated dynamic token refresh endpoint from upstream vietanhtv
app.get("/api/token-refresh", async (req, res) => {
  try {
    const channelName = ((req.query.channelName as string) || "").trim();
    const channelId = ((req.query.channelId as string) || "").trim();
    const currentUrl = ((req.query.url as string) || "").trim();

    const data = await fetchPlaylists(true); // Force real-time refresh from vietanhtv
    const chs = data.channels || [];

    const getParamId = (u: string) => {
      const m = u.match(/[?&]id=([^&]+)/i);
      return m ? m[1].toLowerCase() : "";
    };

    const targetParamId = getParamId(currentUrl);
    const normTarget = channelName.toLowerCase().replace(/\s+/g, "");

    const matched = chs.find((c) => {
      // 1. Match by channel name (e.g., "tv360+1")
      if (normTarget) {
        const normClean = (c.cleanName || "").toLowerCase().replace(/\s+/g, "");
        const normRaw = (c.name || "").toLowerCase().replace(/\s+/g, "");
        if (normClean === normTarget || normRaw === normTarget) return true;
      }
      // 2. Match by exact stream ID param (e.g. ?id=2554)
      if (targetParamId && getParamId(c.url) === targetParamId) return true;
      // 3. Match by channelId
      if (channelId && c.id === channelId) return true;
      return false;
    });

    if (matched) {
      // Ensure TV360+ channel has mandatory Dalvik headers
      const isTv360 = (matched.cleanName || "").toUpperCase().includes("TV360+") || (matched.url || "").includes("tv360.php");
      if (isTv360 && !matched.headers) {
        matched.headers = {
          "User-Agent": "Dalvik/2.1.0",
          "Referer": "https://tv360.vn/",
          "Origin": "https://tv360.vn"
        };
      }
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.json({
        success: true,
        channel: matched
      });
    }

    return res.json({ success: false, message: "Channel not found in fresh vietanhtv playlist" });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to refresh token", details: err.message });
  }
});

// Proxy endpoint to fetch merged M3U playlist with fresh tokens and DRM
app.get("/api/m3u", async (req, res) => {
  try {
    const data = await fetchPlaylists();
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.send(data.m3uText);
  } catch (err: any) {
    return res.status(502).json({
      error: "Unable to load M3U playlist from upstream servers",
      primary: PRIMARY_HT_TV_URL
    });
  }
});

// ClearKey / License URL resolver with 2s timeout
app.get("/api/clearkey", async (req, res) => {
  const licenseUrl = req.query.url as string;
  const isVietanhOrTv360 =
    licenseUrl?.includes("vietanhtv") ||
    licenseUrl?.includes("cleankey.php") ||
    licenseUrl?.includes("tv360") ||
    licenseUrl?.includes("viettel");
  const forcedUa = (req.query.ua as string) || (isVietanhOrTv360 ? "Dalvik/2.1.0" : (req.headers["user-agent"] as string) || "Mozilla/5.0");
  if (!licenseUrl) {
    return res.status(400).json({ error: "Missing license URL" });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout requirement

    const response = await fetch(licenseUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": forcedUa,
        "Accept": "*/*"
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return res.status(response.status).json({ error: `License server responded with ${response.status}` });
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return res.json(data);
    }

    const text = await response.text();
    return res.setHeader("Content-Type", "text/plain").send(text);
  } catch (err: any) {
    return res.status(504).json({ error: "ClearKey license request timed out (2s) or failed", details: err.message });
  }
});

// High-performance streaming proxy supporting multi-hop redirects (up to 6 hops), VLC User-Agent, and zero-copy pipe streaming
function handleStreamProxy(req: express.Request, res: express.Response) {
  const targetUrl = (req.query.url as string || "").trim();
  const customUa = req.query.ua as string;
  const customReferer = req.query.referer as string;
  const isOriginLivesport = targetUrl.toLowerCase().includes("livesport.io.vn") || targetUrl.toLowerCase().includes("livesport");
  const isOriginThirdPartyApi =
    targetUrl.toLowerCase().includes("freem3u.xyz") ||
    targetUrl.toLowerCase().includes("vmttv.dpdns.org") ||
    targetUrl.toLowerCase().includes("?vid=") ||
    targetUrl.toLowerCase().includes("&vid=") ||
    targetUrl.toLowerCase().includes("?id=") ||
    targetUrl.toLowerCase().includes("&id=");

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  // Always enable CORS headers immediately
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges, Transfer-Encoding");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  let activeUpstreamReq: http.ClientRequest | null = null;
  let activeUpstreamRes: http.IncomingMessage | null = null;
  let activeUpstreamSocket: any = null;
  let activePassThrough: PassThrough | null = null;
  let isClosed = false;
  let redirectCount = 0;
  let inactivityTimer: NodeJS.Timeout | null = null;
  const MAX_REDIRECTS = 6;

  // Cleanup Connection (Ngắt luồng tức thì):
  // Lắng nghe sự kiện ngắt kết nối từ client (close, aborted). Khi client ngắt kết nối,
  // proxy lập tức gọi destroy() đối với luồng upstream để giải phóng kết nối Xtream Codes,
  // ngăn chặn tình trạng kẹt kết nối dẫn đến lỗi Max Connections.
  const cleanupUpstream = () => {
    isClosed = true;
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
    if (activePassThrough) {
      try {
        activePassThrough.unpipe();
      } catch (_) {}
      if (!activePassThrough.destroyed) {
        try {
          activePassThrough.destroy();
        } catch (_) {}
      }
      activePassThrough = null;
    }
    if (activeUpstreamRes) {
      try {
        activeUpstreamRes.unpipe();
      } catch (_) {}
      if (!activeUpstreamRes.destroyed) {
        try {
          activeUpstreamRes.destroy();
        } catch (_) {}
      }
      activeUpstreamRes = null;
    }
    if (activeUpstreamReq && !activeUpstreamReq.destroyed) {
      try {
        activeUpstreamReq.destroy();
      } catch (_) {}
      activeUpstreamReq = null;
    }
    if (activeUpstreamSocket && !activeUpstreamSocket.destroyed) {
      try {
        activeUpstreamSocket.destroy();
      } catch (_) {}
      activeUpstreamSocket = null;
    }
  };

  req.on("close", cleanupUpstream);
  req.on("aborted", cleanupUpstream);
  res.on("close", cleanupUpstream);

  async function executeHop(currentUrlStr: string) {
    if (isClosed) return;

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(currentUrlStr);
    } catch (e: any) {
      if (!res.headersSent) {
        return res.status(400).json({ error: "Invalid target URL", url: currentUrlStr });
      }
      return;
    }

    const isHttps = parsedUrl.protocol === "https:";
    const origin = parsedUrl.origin;
    const lowerTarget = currentUrlStr.toLowerCase();

    // 1. Phân loại luồng kênh trong nước (VTV, HTV, VTVcab, TV360, FPTPlay, VieON)
    // TUYỆT ĐỐI BẢO TOÀN luồng xử lý kênh trong nước, không can thiệp logic riêng của nhóm này
    const isSpecialTv360 =
      lowerTarget.includes("id=175") ||
      lowerTarget.includes("id=32") ||
      lowerTarget.includes("id=31") ||
      lowerTarget.includes("348.m3u8") ||
      lowerTarget.includes("332.m3u8") ||
      lowerTarget.includes("/447/output") ||
      customUa === "Dalvik/2.1.0" ||
      (customReferer && customReferer.includes("tv360"));

    const isTV360 =
      isSpecialTv360 ||
      lowerTarget.includes("tv360") ||
      lowerTarget.includes("vietanhtv") ||
      lowerTarget.includes("viettel") ||
      lowerTarget.includes("cleankey");

    const isDomestic =
      isSpecialTv360 ||
      isTV360 ||
      lowerTarget.includes("fptplay") ||
      lowerTarget.includes("vieon") ||
      lowerTarget.includes("vtvgo") ||
      lowerTarget.includes("htv.com.vn");

    // 2. Nhận diện các domain/từ khóa của nhóm Thể Thao Quốc Tế & máy chủ Xtream Codes
    const isTargetInternationalSports =
      !isDomestic &&
      (req.query.isSports === "1" ||
        req.query.group === "sports" ||
        INTERNATIONAL_SPORTS_DOMAINS.some((domain) => lowerTarget.includes(domain)) ||
        (customUa && customUa.toLowerCase().includes("iptvsmarters")));

    const isSportsOrXtream =
      isTargetInternationalSports ||
      (!isDomestic &&
        (lowerTarget.includes("live.php") ||
          lowerTarget.includes("play_token") ||
          lowerTarget.includes("extension=ts") ||
          lowerTarget.includes(":80/play") ||
          lowerTarget.includes(":80/live") ||
          lowerTarget.includes(":8080/play") ||
          lowerTarget.includes(":8080/live") ||
          lowerTarget.includes("/hls/")));

    // Nhận diện luồng Xtream Codes / MPEG-TS trực tiếp (như zazaint.com, AD SPORTS PREMIUM 1, v.v.)
    const isXtreamCodesOrTs =
      lowerTarget.includes("zazaint.com") ||
      lowerTarget.includes("/live/") ||
      lowerTarget.includes("extension=ts") ||
      (lowerTarget.includes(".ts") && !isDomestic) ||
      lowerTarget.includes(":8080/") ||
      lowerTarget.includes(":80/") ||
      lowerTarget.includes("tharen1") ||
      lowerTarget.includes("terranovax1") ||
      lowerTarget.includes("ifiesta.net");

const CHROME_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const MAG_STALKER_USER_AGENT =
  "Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3";

    // Nhận diện luồng MAG/Stalker portal (qua MAC address hoặc play_token)
    const isStalkerOrMag =
      lowerTarget.includes("mac=") ||
      lowerTarget.includes("play_token=") ||
      lowerTarget.includes("play_token") ||
      Boolean(req.query.mac) ||
      Boolean(req.query.play_token);

    const isLivesport =
      isOriginLivesport ||
      lowerTarget.includes("livesport.io.vn") ||
      lowerTarget.includes("livesport") ||
      req.query.isLivesport === "1";
    const isTv360Stream = isSpecialTv360 || isTV360 || lowerTarget.includes("tv360") || lowerTarget.includes("vietanhtv");
    const isThirdPartyApi = isOriginThirdPartyApi || isThirdPartyApiUrl(currentUrlStr);

    let userAgent = "VLC/3.0.18 LibVLC/3.0.18";
    if (isStalkerOrMag) {
      userAgent = MAG_STALKER_USER_AGENT;
    } else if (isLivesport) {
      userAgent = "IPTVSmartersPro/3.1.5.1 (Linux; Android 10)";
    } else if (isXtreamCodesOrTs) {
      userAgent = customUa || "IPTVSmartersPlayer";
    } else if (isTv360Stream || isThirdPartyApi) {
      userAgent = customUa || "Dalvik/2.1.0";
    } else if (customUa) {
      userAgent = customUa;
    } else if (isTargetInternationalSports || isSportsOrXtream) {
      userAgent = "IPTVSmartersPlayer";
    }

    const requestHeaders: Record<string, string> = {
      "User-Agent": userAgent,
      "Accept": "*/*",
      "Accept-Encoding": "identity",
      "Connection": "keep-alive",
      "Icy-MetaData": "1",
    };

    if (isStalkerOrMag) {
      // Chuẩn hóa User-Agent cho luồng MAG/Stalker tại Proxy theo chuẩn MAG200
      requestHeaders["User-Agent"] = MAG_STALKER_USER_AGENT;
      requestHeaders["Accept"] = "*/*";
      requestHeaders["Connection"] = "keep-alive";
      // Loại bỏ Referer và Origin trình duyệt để máy chủ Stalker/Ministra không từ chối kết nối
      delete requestHeaders["Referer"];
      delete requestHeaders["Origin"];
    } else if (isLivesport) {
      // Chuẩn hóa User-Agent cho luồng livesport (TSN 1-5, UNITE8 SPORT 1-2):
      // Dùng IPTVSmartersPro, tuyệt đối không gửi Referer/Origin để tránh server livesport chặn hotlink chuyển hướng sang spo.mp4
      requestHeaders["User-Agent"] = "IPTVSmartersPro/3.1.5.1 (Linux; Android 10)";
      requestHeaders["Accept"] = "*/*";
      requestHeaders["Connection"] = "keep-alive";
      delete requestHeaders["Referer"];
      delete requestHeaders["Origin"];
      delete requestHeaders["sec-fetch-dest"];
      delete requestHeaders["sec-fetch-mode"];
      delete requestHeaders["sec-fetch-site"];
    } else if (isXtreamCodesOrTs) {
      // Gán header User-Agent IPTVSmartersPlayer cho Xtream Codes / TS (như zazaint.com) thay vì default
      requestHeaders["User-Agent"] = customUa || "IPTVSmartersPlayer";
      requestHeaders["Accept"] = "*/*";
      requestHeaders["Connection"] = "keep-alive";
      if (customReferer) {
        requestHeaders["Referer"] = customReferer;
      }
      delete requestHeaders["Origin"];
    } else if (isTargetInternationalSports || isSportsOrXtream) {
      requestHeaders["User-Agent"] = customUa || "IPTVSmartersPlayer";
      requestHeaders["Accept"] = "*/*";
      requestHeaders["Connection"] = "keep-alive";
      if (customReferer) {
        requestHeaders["Referer"] = customReferer;
      }
      delete requestHeaders["Origin"];
    } else if (isTv360Stream || isThirdPartyApi) {
      requestHeaders["User-Agent"] = customUa || "Dalvik/2.1.0";
      requestHeaders["Referer"] = customReferer || "https://tv360.vn/";
      requestHeaders["Origin"] = "https://tv360.vn";
    } else if (lowerTarget.includes("fptplay")) {
      requestHeaders["Referer"] = "https://fptplay.vn/";
      requestHeaders["Origin"] = "https://fptplay.vn/";
    } else if (customReferer) {
      requestHeaders["Referer"] = customReferer;
    } else if (origin) {
      requestHeaders["Referer"] = origin + "/";
      requestHeaders["Origin"] = origin;
    }

    if (req.headers.range) {
      requestHeaders["Range"] = req.headers.range as string;
    }

    // Cấu hình HTTP Agent / HTTPS Agent với tham số rejectUnauthorized: false để bỏ qua lỗi chứng chỉ SSL giả mạo
    const sportsAgent = isTargetInternationalSports
      ? (isHttps ? sportsHttpsAgent : sportsHttpAgent)
      : undefined;

    const client = isHttps ? https : http;

    // Fast-Fail / Timeout ngắn cho khâu kết nối:
    // Đối với các request upstream lấy playlist (.m3u8, .mpd), đặt timeout kết nối ngắn (4 giây).
    // Nếu server nguồn không phản hồi header trong thời gian này, ngắt ngay và trả về HTTP 504 để frontend chủ động fallback.
    const isPlaylistReq = lowerTarget.includes(".m3u8") || lowerTarget.includes(".mpd");

    const connectTimeout = isLivesport
      ? 15000 // Tăng timeout kết nối manifest lên 15 giây để script stalkvip.php kịp phản hồi danh sách phát
      : (isPlaylistReq && isTv360Stream)
      ? 10000 // 10s cho TV360 playlist/MPD qua redirect CDN
      : isPlaylistReq
      ? 4000 // Fast-Fail 4s cho playlist (.m3u8, .mpd) thông thường
      : isTargetInternationalSports || isSportsOrXtream || isTv360Stream
      ? 10000 // 10s cho Xtream Codes / Thể Thao Quốc Tế / TV360
      : lowerTarget.includes(".ts")
      ? 15000
      : 8000;

    const clientReq = client.request(parsedUrl, {
      method: "GET",
      headers: requestHeaders,
      agent: sportsAgent,
      timeout: connectTimeout,
    }, (upstreamRes) => {
      activeUpstreamRes = upstreamRes;
      if (isClosed) {
        cleanupUpstream();
        return;
      }

      try {
        clientReq.setTimeout(0);
        if (upstreamRes.socket) {
          upstreamRes.socket.setKeepAlive(false);
          try {
            upstreamRes.socket.setNoDelay(true);
          } catch (_) {}
        }
        res.setTimeout(0);
        req.setTimeout(0);
      } catch (_) {}

      const statusCode = upstreamRes.statusCode || 200;

      // Handle 301, 302, 303, 307, 308 redirects up to 6 hops
      if ([301, 302, 303, 307, 308].includes(statusCode) && upstreamRes.headers.location) {
        redirectCount++;
        if (redirectCount > MAX_REDIRECTS) {
          cleanupUpstream();
          if (!res.headersSent) {
            return res.status(502).json({ error: `Too many redirects (>${MAX_REDIRECTS})` });
          }
          return;
        }

        let nextUrl: string;
        try {
          nextUrl = new URL(upstreamRes.headers.location, currentUrlStr).href;
        } catch (err: any) {
          cleanupUpstream();
          if (!res.headersSent) {
            return res.status(502).json({ error: "Failed to resolve redirect Location header", location: upstreamRes.headers.location });
          }
          return;
        }

        // Bẫy anti-hotlink của livesport.io.vn: nếu server chuyển hướng đến spo.mp4
        if (nextUrl.includes("spo.mp4") || upstreamRes.headers.location.includes("spo.mp4")) {
          console.warn("[StreamProxy] Phát hiện bẫy anti-hotlink spo.mp4 từ livesport! Tự động đổi User-Agent IPTVSmartersPro và xóa Referer/Origin");
          requestHeaders["User-Agent"] = "IPTVSmartersPro/3.1.5.1 (Linux; Android 10)";
          delete requestHeaders["Referer"];
          delete requestHeaders["Origin"];
          delete requestHeaders["sec-fetch-dest"];
          delete requestHeaders["sec-fetch-mode"];
          delete requestHeaders["sec-fetch-site"];
          cleanupUpstream();
          return executeHop(currentUrlStr);
        }

        // Giải phóng kết nối hop hiện tại trước khi chuyển sang hop tiếp theo
        try {
          upstreamRes.destroy();
        } catch (_) {}
        try {
          clientReq.destroy();
        } catch (_) {}
        activeUpstreamRes = null;
        activeUpstreamReq = null;

        return executeHop(nextUrl);
      }

      const contentType = (upstreamRes.headers["content-type"] as string || "").toLowerCase();
      const lowerUrl = currentUrlStr.toLowerCase();

      // Check if upstream returned HTTP error status
      if (statusCode >= 400) {
        // Tự động thử fallback không kèm play_token nếu Stalker token bị vô hiệu hóa (502, 503, 401, 403, 404)
        if (isStalkerOrMag && currentUrlStr.includes("play_token=") && !currentUrlStr.includes("_no_tok_try")) {
          const fallbackNoToken = currentUrlStr
            .replace(/[?&]play_token=[^&#]*/gi, "")
            .replace(/&&+/g, "&")
            .replace(/\?&/, "?")
            .concat(currentUrlStr.includes("?") ? "&_no_tok_try=1" : "?_no_tok_try=1");

          cleanupUpstream();
          return executeHop(fallbackNoToken);
        }

        upstreamRes.resume();
        if (!res.headersSent) {
          return res.status(statusCode === 404 ? 404 : 502).json({
            error: `Upstream server responded with HTTP ${statusCode}`,
            url: currentUrlStr,
            contentType
          });
        }
        return;
      }

      const isLivesportUrl = isOriginLivesport || lowerUrl.includes("livesport.io.vn") || lowerUrl.includes("livesport");

      const isManifestOrMedia =
        lowerUrl.includes(".mpd") ||
        lowerUrl.includes(".m3u8") ||
        lowerUrl.includes("tv360.php") ||
        lowerUrl.includes("vieon.php") ||
        (isLivesportUrl && (lowerUrl.includes(".php") || lowerUrl.includes("id="))) ||
        lowerUrl.includes(".ts") ||
        lowerUrl.includes(".m4s") ||
        lowerUrl.includes(".mp4");

      // Reject HTML response when a media stream or manifest is requested (prevents XML parsing errors in Shaka / Hls.js)
      // Chú ý: TUYỆT ĐỐI không reject đối với nhóm Thể Thao Quốc Tế & livesport vì server upstream
      // có thể trả content-type: text/html cho cả playlist và chunks
      if (!isTargetInternationalSports && !isLivesportUrl && isManifestOrMedia && (contentType.includes("text/html") || contentType.includes("application/xhtml+xml"))) {
        upstreamRes.resume();
        if (!res.headersSent) {
          return res.status(502).json({
            error: "Upstream returned HTML error page instead of media manifest/stream",
            contentType,
            url: currentUrlStr
          });
        }
        return;
      }

      const isSegmentOrTs =
        lowerUrl.includes(".ts") ||
        lowerUrl.includes(".m4s") ||
        lowerUrl.includes("tokenized") ||
        contentType.includes("mp2t") ||
        contentType.includes("mpegts");

      // Check if it's an M3U8 playlist (bao gồm các link .php của livesport.io.vn như vip1.php?id=uni2)
      const isM3U8 =
        !isSegmentOrTs && (
          lowerUrl.includes(".m3u8") ||
          (isLivesportUrl && (lowerUrl.includes(".php") || lowerUrl.includes("vip1.php") || lowerUrl.includes("id="))) ||
          (isTargetInternationalSports && (lowerUrl.includes("-got.htm") || lowerUrl.includes("usergen"))) ||
          contentType.includes("mpegurl") ||
          contentType.includes("application/x-mpegurl") ||
          contentType.includes("application/vnd.apple.mpegurl")
        );

      if (isM3U8 && !isSegmentOrTs) {
        let buffer = "";
        upstreamRes.setEncoding("utf-8");
        upstreamRes.on("data", (chunk) => {
          buffer += chunk;
        });

        upstreamRes.on("end", () => {
          if (isClosed) return;
          const trimmed = buffer.trim();
          // Verify it's not an HTML page disguised or error payload
          if (
            (isLivesportUrl && !trimmed.includes("#EXTM3U")) ||
            (!isTargetInternationalSports &&
             !isLivesportUrl &&
             (trimmed.toLowerCase().includes("<html") ||
              trimmed.toLowerCase().includes("<!doctype html") ||
              (!trimmed.includes("#EXTM3U") && !trimmed.includes("#EXTINF"))))
          ) {
            if (!res.headersSent) {
              return res.status(502).json({
                error: isLivesportUrl ? "Nguồn phát trả về nội dung không hợp lệ (HTML/Empty)" : "Upstream returned invalid content (HTML/non-M3U8) for M3U8 playlist",
                url: currentUrlStr
              });
            }
            return;
          }

          res.setHeader("Content-Type", "application/vnd.apple.mpegurl; charset=utf-8");
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, no-transform");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
          res.setHeader("X-Accel-Buffering", "no");

          const isSports = isTargetInternationalSports || isSportsOrXtream;
          const isLivesportStream = isLivesportUrl || isLivesport;
          const isThirdPartyStream = isOriginThirdPartyApi || isThirdPartyApi;
          const uaParam = (isSpecialTv360 || isThirdPartyStream)
            ? `&ua=Dalvik%2F2.1.0`
            : isLivesportStream
            ? `&ua=IPTVSmartersPro%2F3.1.5.1%20(Linux%3B%20Android%2010)`
            : isStalkerOrMag
            ? `&ua=${encodeURIComponent(MAG_STALKER_USER_AGENT)}`
            : isSports
            ? `&ua=IPTVSmartersPro%2F3.1.5.1%20(Linux%3B%20Android%2010)`
            : (customUa ? `&ua=${encodeURIComponent(customUa)}` : "");
          const effectiveReferer = (isSpecialTv360 || isThirdPartyStream)
            ? "https://tv360.vn/"
            : isLivesportStream
            ? ""
            : isSports
            ? (customReferer || "")
            : (customReferer || currentUrlStr);
          const refParam = effectiveReferer ? `&referer=${encodeURIComponent(effectiveReferer)}` : "";
          const sportsParam = isSports && !isLivesportStream ? "&isSports=1" : "";
          const livesportParam = isLivesportStream ? "&isLivesport=1" : "";
          const proxyParams = `${uaParam}${refParam}${sportsParam}${livesportParam}`;

          const rewritten = buffer.split("\n").map((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return line;

            if (trimmedLine.startsWith("#")) {
              if (trimmedLine.includes('URI="')) {
                return trimmedLine.replace(/URI="([^"]+)"/g, (_match, uriVal) => {
                  try {
                    const resolvedUri = new URL(uriVal, currentUrlStr).href;
                    return `URI="/api/stream-proxy?url=${encodeURIComponent(resolvedUri)}${proxyParams}"`;
                  } catch {
                    return `URI="${uriVal}"`;
                  }
                });
              }
              return line;
            }

            try {
              const resolvedSegment = new URL(trimmedLine, currentUrlStr).href;
              return `/api/stream-proxy?url=${encodeURIComponent(resolvedSegment)}${proxyParams}`;
            } catch {
              return trimmedLine;
            }
          }).join("\n");

          return res.send(rewritten);
        });

        upstreamRes.on("error", (err) => {
          if (!res.headersSent) {
            res.status(502).json({ error: "M3U8 upstream error", message: err.message });
          }
        });
        return;
      }

      // MPD DASH Manifest
      const isMpd = lowerUrl.includes(".mpd") || contentType.includes("dash+xml");
      if (isMpd) {
        let mpdBuffer = "";
        upstreamRes.setEncoding("utf-8");
        upstreamRes.on("data", (chunk) => { mpdBuffer += chunk; });
        upstreamRes.on("end", () => {
          if (isClosed) return;
          const trimmed = mpdBuffer.trim();
          // Verify it's actually valid MPD XML and not an HTML error document
          if (
            trimmed.toLowerCase().includes("<html") ||
            trimmed.toLowerCase().includes("<!doctype html") ||
            !trimmed.includes("<MPD")
          ) {
            if (!res.headersSent) {
              return res.status(502).json({
                error: "Upstream returned HTML error page instead of valid DASH MPD manifest",
                url: currentUrlStr
              });
            }
            return;
          }

          res.setHeader("Content-Type", "application/dash+xml; charset=utf-8");
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, no-transform");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
          res.setHeader("X-Accel-Buffering", "no");

          const baseUrl = currentUrlStr.substring(0, currentUrlStr.lastIndexOf("/") + 1);
          let rewrittenMpd = mpdBuffer;

          // Rewrite any relative <BaseURL> into absolute URL
          if (rewrittenMpd.includes("<BaseURL>")) {
            rewrittenMpd = rewrittenMpd.replace(/<BaseURL>([^<]+)<\/BaseURL>/gi, (match, rel) => {
              const trimmedRel = rel.trim();
              if (trimmedRel.startsWith("http://") || trimmedRel.startsWith("https://")) {
                return match;
              }
              try {
                const abs = new URL(trimmedRel, baseUrl).href;
                return `<BaseURL>${abs}</BaseURL>`;
              } catch {
                return match;
              }
            });
          } else if (baseUrl) {
            rewrittenMpd = rewrittenMpd.replace(/<MPD([^>]*)>/i, `<MPD$1>\n    <BaseURL>${baseUrl}</BaseURL>`);
          }

          return res.send(rewrittenMpd);
        });
        upstreamRes.on("error", (err) => {
          if (!res.headersSent) {
            res.status(502).json({ error: "MPD upstream error", message: err.message });
          }
        });
        return;
      }

      // Raw MPEG-TS Live Stream, Segment, or Binary Video Stream
      const isMpegTs =
        !isLivesportUrl && (
          contentType.includes("mp2t") ||
          contentType.includes("mpegts") ||
          lowerUrl.includes(".ts") ||
          lowerUrl.includes("tokenized") ||
          lowerUrl.includes("extension=ts") ||
          lowerUrl.includes("mac=") ||
          lowerUrl.includes("play_token=") ||
          lowerUrl.includes("live.php") ||
          lowerUrl.includes("ifiesta.net") ||
          lowerUrl.includes("zazaint.com") ||
          lowerUrl.includes("watchtivo") ||
          lowerUrl.includes("tivi-one-iptv") ||
          lowerUrl.includes("apolonbox") ||
          lowerUrl.includes("royallivetv") ||
          lowerUrl.includes("/hls/") ||
          lowerUrl.includes(":80/") ||
          lowerUrl.includes(":8080/") ||
          (isTargetInternationalSports && !isM3U8 && !isMpd)
        );

      if (isMpegTs) {
        res.setHeader("Content-Type", "video/mp2t");
      } else if (contentType) {
        res.setHeader("Content-Type", contentType);
      } else {
        res.setHeader("Content-Type", "application/octet-stream");
      }

      // Forward caching, zero-buffering and range headers
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, no-transform");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("X-Accel-Buffering", "no");

      if (upstreamRes.headers["content-range"]) {
        res.setHeader("Content-Range", upstreamRes.headers["content-range"] as string);
      }
      if (upstreamRes.headers["content-length"]) {
        res.setHeader("Content-Length", upstreamRes.headers["content-length"] as string);
      }

      res.status(statusCode);

      // Stream with instant zero-copy pipe and active connection cleanup
      upstreamRes.on("error", (err) => {
        cleanupUpstream();
        if (!res.headersSent) {
          res.status(502).end();
        } else {
          res.end();
        }
      });

      upstreamRes.on("end", () => {
        cleanupUpstream();
      });

      upstreamRes.on("close", () => {
        cleanupUpstream();
      });

      res.on("error", () => {
        cleanupUpstream();
      });

      res.on("close", () => {
        cleanupUpstream();
      });

      res.on("finish", () => {
        cleanupUpstream();
      });

      // Bổ sung Data Inactivity Timeout: Nếu máy chủ upstream nhận kết nối nhưng bị treo dữ liệu (không gửi video quá 25s)
      const resetInactivityTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        const timeoutMs = 25000;
        inactivityTimer = setTimeout(() => {
          cleanupUpstream();
          if (!res.headersSent && !isClosed) {
            res.status(504).json({
              error: "Upstream stream data stalled (timeout)",
              url: currentUrlStr,
            });
          } else if (!res.writableEnded) {
            res.end();
          }
        }, timeoutMs);
      };

      if (isTargetInternationalSports || isSportsOrXtream) {
        resetInactivityTimer();
        upstreamRes.on("data", () => {
          resetInactivityTimer();
        });
      }

      // Fast-forward headers immediately
      try {
        res.flushHeaders();
      } catch (_) {}

      // Tắt Nagle's algorithm trên response socket để gửi chunk tức thì không giữ đệm TCP
      if (res.socket) {
        try {
          res.socket.setNoDelay(true);
        } catch (_) {}
      }

      // Zero-latency chunk forwarding: Bỏ qua mọi queue/buffer tích lũy dữ liệu trung gian, flush ngay khi có data chunk
      upstreamRes.on("data", (chunk: Buffer) => {
        if (!isClosed && !res.writableEnded) {
          const drained = res.write(chunk);
          if (typeof (res as any).flush === 'function') {
            try {
              (res as any).flush();
            } catch (_) {}
          }
          if (!drained) {
            upstreamRes.pause();
          }
        }
      });

      res.on("drain", () => {
        if (!isClosed && upstreamRes.readable) {
          upstreamRes.resume();
        }
      });

      upstreamRes.on("end", () => {
        cleanupUpstream();
        if (!res.writableEnded) {
          res.end();
        }
      });
    });

    activeUpstreamReq = clientReq;
    clientReq.on("socket", (sock) => {
      activeUpstreamSocket = sock;
      try {
        sock.setNoDelay(true);
      } catch (_) {}
      sock.on("close", () => {
        if (activeUpstreamSocket === sock) activeUpstreamSocket = null;
      });
    });

    if (isClosed) {
      cleanupUpstream();
      return;
    }

    clientReq.on("error", (err: any) => {
      cleanupUpstream();
      if (isClosed || req.destroyed) return;
      if (!res.headersSent) {
        res.status(502).json({ error: "Stream proxy upstream connection error", message: err.message });
      } else if (!res.writableEnded) {
        res.end();
      }
    });

    clientReq.on("timeout", () => {
      cleanupUpstream();
      if (!res.headersSent && !isClosed) {
        res.status(504).json({
          error: isPlaylistReq
            ? "Playlist (.m3u8) upstream connection timed out (Fast-Fail 4s)"
            : "Stream upstream connection timed out",
          url: currentUrlStr,
        });
      } else if (!res.writableEnded) {
        res.end();
      }
    });

    clientReq.end();
  }

  executeHop(targetUrl);
}

// Dynamic M3U8 Generator: Bọc luồng TS/MPEG-TS thành dynamic HLS manifest cho trình duyệt nếu cần
function handleM3u8Wrap(req: express.Request, res: express.Response) {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Content-Type", "application/vnd.apple.mpegurl; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, no-transform");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const seq = Math.floor(Date.now() / 3000);
  const uaParam = req.query.ua ? `&ua=${encodeURIComponent(req.query.ua as string)}` : "";
  const proxyChunkUrl = `/api/stream-proxy?url=${encodeURIComponent(targetUrl)}${uaParam}`;

  const manifest = [
    "#EXTM3U",
    "#EXT-X-VERSION:3",
    "#EXT-X-TARGETDURATION:4",
    `#EXT-X-MEDIA-SEQUENCE:${seq}`,
    "#EXTINF:3.000,",
    `${proxyChunkUrl}&chunk=${seq}`,
    "#EXTINF:3.000,",
    `${proxyChunkUrl}&chunk=${seq + 1}`,
  ].join("\n");

  return res.send(manifest);
}

// Endpoints for Stream Proxy, CORS Proxy, and Dynamic M3U8 Generator
app.get("/api/stream-proxy", handleStreamProxy);
app.get("/api/proxy", handleStreamProxy);
app.get("/api/m3u8-wrap", handleM3u8Wrap);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "HT TV", timestamp: Date.now() });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HT TV server running at http://0.0.0.0:${PORT}`);

    // Periodic background token refresh every 90 seconds to keep tokens perpetually valid
    setInterval(() => {
      fetchPlaylists(true).catch((err) => {
        console.warn("[Background Token Refresh] Warning:", err.message);
      });
    }, 90 * 1000);
  });
}

startServer();
