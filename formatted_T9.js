const T9 = ({
  channel: g,
  url: i,
  isLive: s = !0,
  onPlaybackSuccess: o,
  onToggleDrawer: c,
  onError: p,
  onAutoNextChannel: v,
}) => {
  const f = Pt.useMemo(() => {
      if (g) return g;
      if (i) {
        const Ze = i.toLowerCase(),
          mt = Ze.includes(".mpd")
            ? "dash"
            : Ze.includes(".m3u8")
              ? "hls"
              : "ts";
        return {
          id: "direct-url",
          name: "Live Stream",
          cleanName: "Live Stream",
          logo: "",
          group: "Live",
          url: i,
          backupUrls: [],
          format: mt,
        };
      }
      return null;
    }, [g, i]),
    S = Pt.useRef(null),
    E = Pt.useRef(null),
    [A, R] = Pt.useState(!0),
    [L, k] = Pt.useState(null),
    [P, U] = Pt.useState(0),
    [G, K] = Pt.useState(""),
    [W, z] = Pt.useState(!1),
    [se, X] = Pt.useState(!1),
    de = Pt.useCallback(() => {
      var Ze, mt;
      return typeof window > "u"
        ? !0
        : (mt = (Ze = window.screen) == null ? void 0 : Ze.orientation) !=
              null && mt.type
          ? window.screen.orientation.type.startsWith("landscape")
          : window.innerWidth > window.innerHeight;
    }, []),
    [w, le] = Pt.useState(() => {
      var Ze, mt;
      return typeof window > "u"
        ? !0
        : (mt = (Ze = window.screen) == null ? void 0 : Ze.orientation) !=
              null && mt.type
          ? window.screen.orientation.type.startsWith("landscape")
          : window.innerWidth > window.innerHeight;
    }),
    he = Pt.useRef(null),
    te = Pt.useRef(null),
    oe = Pt.useRef(null),
    re = Pt.useRef(null),
    ge = Pt.useRef("none"),
    Ye = Pt.useRef(0),
    je = Pt.useRef(null),
    Te = Pt.useRef(null),
    Ie = Pt.useRef(null),
    Pe = Pt.useRef(null),
    Be = Pt.useRef(null),
    Xe = Pt.useRef(null),
    ye = Pt.useRef(!1),
    Y = Pt.useRef(null),
    We = Pt.useRef(null),
    Ee = Pt.useRef(null),
    fe = Pt.useRef(0),
    Le = Pt.useRef(0),
    Je = Pt.useRef(null),
    Et = Pt.useRef(0),
    Ue = Pt.useRef(0),
    at = Pt.useRef(!1),
    St = Pt.useRef(!1),
    Bt = Pt.useRef(0),
    kt = Pt.useRef(0),
    Gt = Pt.useRef(0),
    At = Pt.useRef(null),
    bt = Pt.useRef(null),
    un = Pt.useRef(null),
    vn = Pt.useRef([]),
    On = Pt.useRef(0),
    Yn = Pt.useRef(!1),
    ii = Pt.useRef(null),
    Pn = Pt.useRef(!1),
    Wi = Pt.useRef(!1);
  (Pt.useEffect(() => {
    const Ze = () => {
      Wi.current = !0;
      const mt = S.current;
      mt &&
        (mt.muted && (mt.muted = !1), mt.paused && mt.play().catch(() => {}));
    };
    return (
      window.addEventListener("click", Ze, { passive: !0 }),
      window.addEventListener("touchstart", Ze, { passive: !0 }),
      window.addEventListener("keydown", Ze, { passive: !0 }),
      () => {
        (window.removeEventListener("click", Ze),
          window.removeEventListener("touchstart", Ze),
          window.removeEventListener("keydown", Ze));
      }
    );
  }, []),
    Pt.useEffect(() => {
      try {
        al.polyfill && al.polyfill.installAll();
        const Ze = al;
        if (Ze.log) {
          Ze.log.setLevel &&
            Ze.log.Level &&
            Ze.log.setLevel(Ze.log.Level.ERROR);
          const cn = Ze.log.error;
          typeof cn == "function" &&
            (Ze.log.error = (...hn) => {
              const zt = hn[0],
                fn =
                  typeof zt == "string"
                    ? zt
                    : zt != null && zt.message
                      ? String(zt.message)
                      : "",
                Ct = hn[1],
                Tr =
                  (Ct == null ? void 0 : Ct.code) ||
                  (zt == null ? void 0 : zt.code);
              if (
                Tr === 3015 ||
                Tr === 3014 ||
                Tr === 3018 ||
                Tr === 7e3 ||
                fn.includes("3015") ||
                fn.includes("LOAD_INTERRUPTED") ||
                fn.includes("MEDIA_SOURCE_OPERATION_THREW")
              ) {
                (Ct && typeof Ct == "object" && (Ct.handled = !0),
                  zt && typeof zt == "object" && (zt.handled = !0));
                return;
              }
              cn(...hn);
            });
          const Ci = Ze.log.alwaysError;
          typeof Ci == "function" &&
            (Ze.log.alwaysError = (...hn) => {
              const zt = typeof hn[0] == "string" ? hn[0] : "";
              zt.includes("Expected MediaSource to be open") ||
                zt.includes("reopening the media source") ||
                Ci(...hn);
            });
        }
        let mt = () => {};
        if (typeof window < "u") {
          const cn = (hn) => {
              const zt =
                  (hn == null ? void 0 : hn.error) ||
                  (hn == null ? void 0 : hn.detail) ||
                  hn,
                fn = String(
                  (hn == null ? void 0 : hn.message) ||
                    (zt == null ? void 0 : zt.message) ||
                    "",
                );
              if (
                (zt == null ? void 0 : zt.code) === 3015 ||
                (zt == null ? void 0 : zt.code) === 3014 ||
                (zt == null ? void 0 : zt.code) === 3018 ||
                (zt == null ? void 0 : zt.code) === 7e3 ||
                fn.includes("3015") ||
                fn.includes("Shaka Error 3015") ||
                fn.includes("LOAD_INTERRUPTED") ||
                fn.includes("MEDIA_SOURCE_OPERATION_THREW")
              )
                return (
                  zt && typeof zt == "object" && (zt.handled = !0),
                  typeof (hn == null ? void 0 : hn.preventDefault) ==
                    "function" && hn.preventDefault(),
                  typeof (hn == null ? void 0 : hn.stopPropagation) ==
                    "function" && hn.stopPropagation(),
                  !0
                );
            },
            Ci = (hn) => {
              const zt = hn == null ? void 0 : hn.reason,
                fn = String((zt == null ? void 0 : zt.message) || zt || "");
              ((zt == null ? void 0 : zt.code) === 3015 ||
                (zt == null ? void 0 : zt.code) === 3014 ||
                (zt == null ? void 0 : zt.code) === 3018 ||
                (zt == null ? void 0 : zt.code) === 7e3 ||
                fn.includes("3015") ||
                fn.includes("Shaka Error 3015") ||
                fn.includes("LOAD_INTERRUPTED") ||
                fn.includes("MEDIA_SOURCE_OPERATION_THREW")) &&
                (zt && typeof zt == "object" && (zt.handled = !0),
                typeof (hn == null ? void 0 : hn.preventDefault) ==
                  "function" && hn.preventDefault(),
                typeof (hn == null ? void 0 : hn.stopPropagation) ==
                  "function" && hn.stopPropagation());
            };
          if (
            (window.addEventListener("error", cn, !0),
            window.addEventListener("unhandledrejection", Ci, !0),
            window.console && window.console.error)
          ) {
            const hn = window.console.error;
            window.console.error = function (...zt) {
              const fn = zt[0],
                Ct =
                  typeof fn == "string"
                    ? fn
                    : fn != null && fn.message
                      ? String(fn.message)
                      : "",
                Tr = zt[1],
                Bn =
                  (Tr == null ? void 0 : Tr.code) ||
                  (fn == null ? void 0 : fn.code);
              if (
                Bn === 3015 ||
                Bn === 3014 ||
                Bn === 3018 ||
                Bn === 7e3 ||
                Ct.includes("Expected MediaSource to be open") ||
                Ct.includes("reopening the media source") ||
                Ct.includes("MediaSource to be open") ||
                Ct.includes("Shaka Error 3015") ||
                Ct.includes("MEDIA_SOURCE_OPERATION_THREW") ||
                Ct.includes("Shaka Error 4000")
              ) {
                window.console.warn &&
                  window.console.warn("[HT TV Stream Recovery]", ...zt);
                return;
              }
              hn.apply(window.console, zt);
            };
          }
          mt = () => {
            (window.removeEventListener("error", cn, !0),
              window.removeEventListener("unhandledrejection", Ci, !0));
          };
        }
        return () => {
          mt();
        };
      } catch (Ze) {
        console.warn("[HT TV] Shaka polyfill error:", Ze);
      }
    }, []));
  const ri = Pt.useCallback((Ze) => {
      if (!Ze) return "";
      if (Ze.startsWith("http://") || Ze.startsWith("https://")) return Ze;
      try {
        return new URL(Ze, window.location.origin).href;
      } catch {
        return (
          (window.location.origin || "") + (Ze.startsWith("/") ? Ze : "/" + Ze)
        );
      }
    }, []),
    gi = Pt.useMemo(() => {
      var In;
      if (!f) return [];
      const Ze =
          f.urls && f.urls.length > 0
            ? f.urls
            : [f.url, ...(f.backupUrls || [])].filter(Boolean),
        mt = bM(Ze, f.cleanName || f.name || "");
      if (!mt) return [];
      const cn = typeof window < "u" ? window.location.origin : "",
        Ci = mt.replace(
          /^.*\/api\/(?:stream-)?proxy\?url=([^&]+).*$/,
          (xe, pn) => decodeURIComponent(pn),
        );
      if (Qc(mt) || Qc(f.url) || Qc(Ci)) {
        const xe =
          ((In = f.headers) == null ? void 0 : In["User-Agent"]) ||
          "Dalvik/2.1.0";
        return [
          `/api/proxy?url=${encodeURIComponent(Ci)}&ua=${encodeURIComponent(xe)}`,
        ];
      }
      if (AI(f, Ci)) return [CM(f, Ci, cn), Ci];
      const zt = Xx.prioritizeUrls([mt]);
      if (CS(f, mt) || W8(f)) {
        const xe = zt
          .map((pn) =>
            pn.replace(
              /^.*\/api\/(?:stream-)?proxy\?url=([^&]+).*$/,
              (ki, Rn) => decodeURIComponent(Rn),
            ),
          )
          .filter(
            (pn) =>
              !pn.includes("/api/stream-proxy") && !pn.includes("/api/proxy"),
          );
        return Array.from(new Set(xe.length > 0 ? xe : [Ci]));
      }
      const Ct = [];
      zt.forEach((xe) => {
        const pn = xe.replace(
          /^.*\/api\/(?:stream-)?proxy\?url=([^&]+).*$/,
          (ki, Rn) => decodeURIComponent(Rn),
        );
        pn &&
          !pn.includes("/api/stream-proxy") &&
          !pn.includes("/api/proxy") &&
          Ct.push(pn);
      });
      const Tr =
          mt.toLowerCase().includes("mac=") ||
          mt.toLowerCase().includes("play_token=") ||
          mt.toLowerCase().includes("/play/live.php"),
        Bn =
          mt.toLowerCase().includes("livesport.io.vn") ||
          mt.toLowerCase().includes("livesport");
      if (Tr || Bn) {
        const xe =
          "Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3";
        let pn = "";
        Tr
          ? (pn = `&ua=${encodeURIComponent(xe)}`)
          : Bn &&
            (pn = `&ua=${encodeURIComponent("IPTVSmartersPro/3.1.5.1 (Linux; Android 10)")}`);
        const ki = `${cn}/api/stream-proxy?url=${encodeURIComponent(mt)}${pn}`;
        Ct.push(ki);
      }
      return Array.from(new Set(Ct.length > 0 ? Ct : [mt]));
    }, [f]),
    Ri = Pt.useCallback((Ze) => {
      if (Ze)
        try {
          if ((Ze.pause(), Ze.srcObject)) {
            const mt = Ze.srcObject;
            (mt &&
              typeof mt.getTracks == "function" &&
              mt.getTracks().forEach((cn) => {
                try {
                  cn.stop();
                } catch {}
              }),
              (Ze.srcObject = null));
          }
          if (Ze.textTracks && Ze.textTracks.length > 0)
            for (let mt = 0; mt < Ze.textTracks.length; mt++)
              Ze.textTracks[mt].mode = "disabled";
          ((Ze.hasAttribute("src") || Ze.src) && Ze.removeAttribute("src"),
            (Ze.currentTime = 0),
            (Ze.playbackRate = 1));
        } catch {}
    }, []),
    wi = Pt.useCallback(async () => {
      var Ze, mt;
      if (
        (Be.current && (clearTimeout(Be.current), (Be.current = null)),
        Xe.current && (clearTimeout(Xe.current), (Xe.current = null)),
        Y.current && (clearTimeout(Y.current), (Y.current = null)),
        je.current && (clearInterval(je.current), (je.current = null)),
        Te.current && (clearTimeout(Te.current), (Te.current = null)),
        Ie.current && (clearTimeout(Ie.current), (Ie.current = null)),
        Pe.current && (clearTimeout(Pe.current), (Pe.current = null)),
        We.current && (clearTimeout(We.current), (We.current = null)),
        At.current && (clearTimeout(At.current), (At.current = null)),
        bt.current && (clearTimeout(bt.current), (bt.current = null)),
        ii.current && (clearTimeout(ii.current), (ii.current = null)),
        (vn.current = []),
        (On.current = 0),
        (Yn.current = !1),
        (Pn.current = !1),
        (un.current = null),
        re.current)
      ) {
        try {
          re.current();
        } catch {}
        re.current = null;
      }
      if (oe.current) {
        const cn = oe.current;
        oe.current = null;
        try {
          ((mt = (Ze = cn._emitter) == null ? void 0 : Ze.removeAllListeners) ==
            null || mt.call(Ze),
            cn.pause(),
            cn.unload(),
            cn.detachMediaElement(),
            cn.destroy());
        } catch {}
      }
      if (te.current) {
        const cn = te.current;
        te.current = null;
        try {
          (cn.stopLoad(), cn.detachMedia(), cn.destroy());
        } catch {}
      }
      if (he.current) {
        const cn = he.current;
        ((he.current = null), (Je.current = null), (Le.current += 1));
        try {
          (await cn.unload().catch(() => {}),
            await cn.detach().catch(() => {}),
            await cn.destroy().catch(() => {}));
        } catch {}
      }
      ((ge.current = "none"), Ri(S.current));
    }, [Ri]),
    $t = Pt.useCallback(() => {
      (bt.current && clearTimeout(bt.current),
        (bt.current = setTimeout(() => {
          (console.log(
            "[HT TV] Nguồn phát không khả dụng - Tự động thử lại ngay...",
          ),
            U((Ze) => Ze + 1));
        }, 2e3)));
    }, []),
    _r = Pt.useCallback(
      async (Ze, mt, cn) => {
        var Si, ec, V, B, O, b, $, J, Q, ae, _e, Ae, Ne, Ce, ke;
        if (fe.current !== mt) return;
        if (!f || gi.length === 0) {
          (R(!1), k("Nguồn phát không khả dụng"), $t());
          return;
        }
        const Ci =
          f.group === "Sự Kiện TV360" ||
          f.group === "Sự Kiện" ||
          (f.cleanName || f.name || "").toUpperCase().includes("TV360+") ||
          (f.url && f.url.includes("tv360.php"));
        if (Ci || f.format === "dash" || !!f.drm || EI(f.url) || Et.current > 0)
          try {
            RM();
            const we = await Y8(f);
            if (
              we &&
              we.url &&
              ((f.url = we.url),
              we.drm && (f.drm = we.drm),
              we.headers && (f.headers = we.headers),
              we.format && (f.format = we.format),
              f.drm && f.drm.type === "clearkey" && f.drm.licenseUrl)
            ) {
              const rt = await IM(f.drm.licenseUrl);
              rt && Object.keys(rt).length > 0 && (f.drm.clearkeyPair = rt);
            }
          } catch {}
        const zt = gi.length,
          fn = Ci || (f.url && f.url.includes("tv360")),
          Ct =
            f.url &&
            (f.url.toLowerCase().includes("zazaint.com") ||
              f.url.toLowerCase().includes("extension=ts") ||
              f.url.toLowerCase().includes("/live/")),
          Tr =
            f.url &&
            (f.url.toLowerCase().includes("livesport.io.vn") ||
              f.url.toLowerCase().includes("livesport")),
          Bn = fn
            ? "Dalvik/2.1.0"
            : Tr
              ? "IPTVSmartersPro/3.1.5.1 (Linux; Android 10)"
              : Ct
                ? "IPTVSmartersPlayer"
                : ((Si = f.headers) == null ? void 0 : Si["User-Agent"]) || "";
        let In = cn || gi[Ze % zt] || f.url;
        if (!In) return;
        if (
          (Qc(In) || (f && Qc(f.url))) &&
          !In.includes("/api/proxy") &&
          !In.includes("/api/stream-proxy")
        ) {
          const we = In.replace(
              /^.*\/api\/(?:stream-)?proxy\?url=([^&]+).*$/,
              (lt, vt) => decodeURIComponent(vt),
            ),
            rt =
              ((ec = f.headers) == null ? void 0 : ec["User-Agent"]) ||
              Bn ||
              "Dalvik/2.1.0";
          In = `/api/proxy?url=${encodeURIComponent(we)}&ua=${encodeURIComponent(rt)}`;
        }
        if (
          ((Ye.current = Ze),
          K(In),
          R(!0),
          (at.current = !1),
          (St.current = !1),
          (ye.current = !1),
          (Gt.current = Date.now()),
          await wi(),
          fe.current !== mt)
        )
          return;
        const pn = S.current;
        if (!pn) return;
        ((pn.muted = !1), (pn.autoplay = !0), (pn.playsInline = !0));
        const ki = async (we, rt) => {
          if (fe.current !== mt || St.current) return;
          if (we.includes("3015") || we.includes("FALLBACK_TO_HLS")) {
            (console.warn(
              "[HT TV] Tự động chuyển đổi sang Hls.js để giải mã trực tiếp luồng MPEG-TS (3015)...",
            ),
              (f.format = "hls"),
              (f.drm = void 0),
              (ge.current = "hls"),
              Y.current && (clearTimeout(Y.current), (Y.current = null)),
              We.current && (clearTimeout(We.current), (We.current = null)),
              await wi(),
              R(!0),
              (at.current = !1),
              (We.current = setTimeout(() => {
                fe.current === mt && _r(Ze, mt);
              }, 100)));
            return;
          }
          ((St.current = !0),
            Xx.recordFailure(In, rt),
            Be.current && (clearTimeout(Be.current), (Be.current = null)),
            Xe.current && (clearTimeout(Xe.current), (Xe.current = null)),
            At.current && (clearTimeout(At.current), (At.current = null)),
            je.current && (clearInterval(je.current), (je.current = null)),
            Te.current && (clearTimeout(Te.current), (Te.current = null)),
            Ie.current && (clearTimeout(Ie.current), (Ie.current = null)));
          const lt = we === "PLAYBACK_FREEZE_WATCHDOG",
            vt = we === "BUFFERING_STALL_5S",
            ft = Ze + 1 < zt;
          if (!vt && lt && !ft && Ue.current < 2) {
            ((Ue.current += 1),
              Y.current && (clearTimeout(Y.current), (Y.current = null)),
              We.current && (clearTimeout(We.current), (We.current = null)),
              R(!0),
              (at.current = !1),
              await wi(),
              (We.current = setTimeout(() => {
                fe.current === mt && _r(Ze, mt);
              }, 300)));
            return;
          }
          if (((Et.current += 1), Et.current >= g9)) {
            (Y.current && (clearTimeout(Y.current), (Y.current = null)),
              We.current && (clearTimeout(We.current), (We.current = null)),
              await wi(),
              R(!1),
              k("Nguồn phát tạm thời gián đoạn"),
              v
                ? (console.log(
                    "[HT TV] Nguồn phát gián đoạn - Tự động chuyển kênh tiếp theo sau 1.5s...",
                  ),
                  (Pe.current = setTimeout(() => {
                    fe.current === mt && v();
                  }, 1500)))
                : $t());
            return;
          }
          const Ge = (Ze + 1) % zt;
          (console.log(
            `[HT TV] Chuyển sang candidate nguồn tiếp theo (candidates: ${Ge + 1}/${zt})`,
          ),
            (We.current = setTimeout(() => {
              fe.current === mt && _r(Ge, mt);
            }, 200)));
        };
        un.current = ki;
        const Rn = Mm(f),
          fs = f.group === "Thể Thao Quốc Tế",
          Xs = /4k|uhd|2160/i.test(`${f.name || ""} ${f.cleanName || ""}`),
          Gr =
            Rn || fs
              ? _9
              : Xs
                ? 16e3
                : f.format === "dash" || f.drm || In.includes(".mpd")
                  ? y9
                  : v9;
        Be.current = setTimeout(() => {
          !at.current &&
            fe.current === mt &&
            ki(`TIMEOUT_${Math.round(Gr / 1e3)}S`);
        }, Gr);
        const ts = () => {
            (je.current && clearInterval(je.current),
              (Bt.current = 0),
              (kt.current = 0),
              (je.current = setInterval(() => {
                if (fe.current !== mt) return;
                const we = S.current;
                if (!we) return;
                if (we.paused) {
                  (Xa(we), (kt.current = 0));
                  return;
                }
                if (
                  we.readyState < 2 ||
                  (we.currentTime > 0 && we.currentTime === Bt.current)
                ) {
                  ((kt.current += 1), kt.current >= 2 && we.paused && Xa(we));
                  const lt =
                      f.group === "Thể Thao Quốc Tế" ||
                      (f.group || "").toLowerCase().includes("thể thao") ||
                      (f.group || "").toLowerCase().includes("sport"),
                    vt = Mm(f),
                    Ge = lt || vt ? 20 : ge.current === "mpegts" ? 12 : 14;
                  kt.current >= Ge &&
                    ((kt.current = 0),
                    console.warn(
                      `[HT TV] Buffering/đứng hình kéo dài ${Ge}s -> Nhảy sang candidate nguồn tiếp theo (candidates: ${Ze + 1}/${zt})`,
                    ),
                    ki(`BUFFERING_STALL_${Ge}S`));
                } else {
                  ((kt.current = 0), (Bt.current = we.currentTime));
                  const lt =
                      f.group === "Thể Thao Quốc Tế" ||
                      (f.group || "").toLowerCase().includes("thể thao") ||
                      (f.group || "").toLowerCase().includes("sport"),
                    vt = Mm(f),
                    ft = lt || vt,
                    Ge = Wx(we);
                  (we.videoWidth > 0 &&
                    Ge > 0 &&
                    (Te.current &&
                      (clearTimeout(Te.current), (Te.current = null)),
                    Ie.current &&
                      (clearTimeout(Ie.current), (Ie.current = null))),
                    ft
                      ? Ge < 2 && we.playbackRate !== 0.97
                        ? (we.playbackRate = 0.97)
                        : Ge >= 3 && Ge < 18 && we.playbackRate !== 1
                          ? (we.playbackRate = 1)
                          : Ge >= 18 &&
                            we.playbackRate !== 1.03 &&
                            (we.playbackRate = 1.03)
                      : Ge < 1.5 && we.playbackRate !== 0.97
                        ? (we.playbackRate = 0.97)
                        : Ge >= 2.5 && Ge < 18 && we.playbackRate !== 1
                          ? (we.playbackRate = 1)
                          : Ge >= 18 &&
                            we.playbackRate !== 1.03 &&
                            (we.playbackRate = 1.03));
                }
              }, 1e3)));
          },
          Kn = (() => {
            try {
              return decodeURIComponent(In).toLowerCase();
            } catch {
              return In.toLowerCase();
            }
          })(),
          cr = In.toLowerCase(),
          Mi = (f.url || "").toLowerCase(),
          ul =
            ((V = f.cleanName) == null
              ? void 0
              : V.toLowerCase().includes("on phim việt")) ||
            ((B = f.cleanName) == null
              ? void 0
              : B.toLowerCase().includes("on phim viet")) ||
            ((O = f.cleanName) == null
              ? void 0
              : O.toLowerCase().includes("phim việt")) ||
            ((b = f.cleanName) == null
              ? void 0
              : b.toLowerCase().includes("hitv")) ||
            (($ = f.cleanName) == null
              ? void 0
              : $.toLowerCase().includes("you tv")) ||
            ((J = f.cleanName) == null
              ? void 0
              : J.toLowerCase().includes("youtv")) ||
            ((Q = f.url) == null ? void 0 : Q.includes("id=175")) ||
            ((ae = f.url) == null ? void 0 : ae.includes("id=32")) ||
            ((_e = f.url) == null ? void 0 : _e.includes("id=31")) ||
            ((Ae = f.url) == null ? void 0 : Ae.includes("348.m3u8")) ||
            ((Ne = f.url) == null ? void 0 : Ne.includes("332.m3u8")) ||
            ((Ce = f.url) == null ? void 0 : Ce.includes("/447/output")) ||
            ((ke = f.url) == null ? void 0 : ke.includes("/eds/450")) ||
            cr.includes("/eds/450") ||
            Kn.includes("/eds/450") ||
            cr.includes("hls_clean") ||
            Kn.includes("hls_clean"),
          Vr =
            Kn.includes("livesport") ||
            cr.includes("livesport") ||
            Mi.includes("livesport"),
          zi =
            cr.includes(".m3u8") ||
            Kn.includes(".m3u8") ||
            Mi.includes(".m3u8") ||
            f.format === "hls" ||
            cr.includes("chunklist") ||
            cr.includes("/zhls/") ||
            cr.includes("/hls/") ||
            cr.includes("hls_clean") ||
            Kn.includes("hls_clean") ||
            cr.includes("vieon.php") ||
            cr.includes("application/vnd.apple.mpegurl") ||
            cr.includes("application/x-mpegurl") ||
            Vr ||
            ul,
          ci =
            !zi &&
            (f.format === "dash" ||
              cr.includes(".mpd") ||
              Kn.includes(".mpd") ||
              (Rn && !!f.drm)),
          vi =
            !zi &&
            !ci &&
            (f.format === "ts" ||
              Kn.includes(".ts") ||
              Kn.includes("extension=ts") ||
              Kn.includes("/play/live.php") ||
              Kn.includes("mac=") ||
              Kn.includes("play_token=") ||
              Kn.includes("ifiesta.net") ||
              Kn.includes("zazaint.com") ||
              Kn.includes("watchtivo") ||
              Kn.includes("innovationtv") ||
              Kn.includes("tivi-one-iptv") ||
              Kn.includes(":80/") ||
              Kn.includes(":8080/") ||
              cr.includes("mac=") ||
              cr.includes("play_token=") ||
              Mi.includes(".ts") ||
              Mi.includes("extension=ts") ||
              Mi.includes("/play/live.php") ||
              Mi.includes("mac=") ||
              Mi.includes("play_token=") ||
              Mi.includes("ifiesta.net") ||
              Mi.includes("zazaint.com") ||
              Mi.includes("watchtivo") ||
              Mi.includes("innovationtv") ||
              Mi.includes("tivi-one-iptv")),
          Oi = zi || (!vi && !ci);
        ((ge.current = ci ? "shaka" : vi ? "mpegts" : "hls"),
          Te.current && clearTimeout(Te.current),
          (Te.current = setTimeout(() => {
            var ft;
            if (fe.current !== mt) return;
            const we = S.current,
              rt = Wx(we),
              lt =
                !In.includes("/api/proxy") && !In.includes("/api/stream-proxy");
            if ((!at.current || rt === 0) && lt) {
              console.warn(
                `[HT TV] Watchdog 4s: Kẹt khởi tạo / bufferAhead === 0 ở chế độ direct (ahead=${rt.toFixed(2)}s). Tự động chuyển ngay sang proxy nội bộ /api/proxy...`,
              );
              const Ge = In.replace(
                  /^.*\/api\/(?:stream-)?proxy\?url=([^&]+).*$/,
                  (Dt, Lt) => decodeURIComponent(Lt),
                ),
                Qe =
                  ((ft = f.headers) == null ? void 0 : ft["User-Agent"]) ||
                  Bn ||
                  "Dalvik/2.1.0",
                Rt = `/api/proxy?url=${encodeURIComponent(Ge)}&ua=${encodeURIComponent(Qe)}`;
              _r(Ze, mt, Rt);
            }
          }, 4e3)),
          Ie.current && clearTimeout(Ie.current),
          (Ie.current = setTimeout(() => {
            if (fe.current !== mt) return;
            const we = S.current,
              rt = Wx(we);
            if ((we ? we.videoWidth : 0) === 0 && rt === 0 && !at.current) {
              if (
                (console.warn(
                  "[HT TV] Watchdog 6s: videoWidth = 0 và bufferAhead = 0 sau 6s. Kích hoạt onError() và fallback sang nguồn tiếp theo.",
                ),
                p)
              )
                try {
                  p(
                    new Error(
                      "Kẹt tải dữ liệu video: videoWidth=0 và bufferAhead=0 sau 6s",
                    ),
                  );
                } catch {}
              ki("TIMEOUT_6S_NO_VIDEO_DATA");
            }
          }, 6e3)),
          Xe.current && (clearTimeout(Xe.current), (Xe.current = null)),
          (Xe.current = setTimeout(() => {
            if (fe.current === mt && !at.current && !ye.current) {
              ((ye.current = !0),
                console.warn(
                  "[HT TV] Watcher 4.5s: Sự kiện playing chưa kích hoạt sau khi chọn kênh -> Tự động làm mới (reload) manifest...",
                ));
              const we = S.current,
                rt = Date.now(),
                lt = In.includes("?") ? "&" : "?",
                vt = `${In}${lt}_t=${rt}`;
              if (ge.current === "hls" && te.current)
                try {
                  (console.log("[HT TV] Làm mới HLS manifest:", vt),
                    te.current.loadSource(vt),
                    te.current.startLoad(),
                    we && Xa(we));
                } catch (ft) {
                  console.warn("[HT TV] Lỗi reload HLS manifest:", ft);
                }
              else if (ge.current === "shaka" && he.current && we)
                try {
                  (console.log("[HT TV] Làm mới Shaka manifest:", vt),
                    Je.current
                      ? Je.current(he.current, we, vt).catch(() => {})
                      : (we.pause(),
                        he.current
                          .unload()
                          .then(() => {
                            var ft;
                            return (ft = he.current) == null
                              ? void 0
                              : ft.load(vt);
                          })
                          .then(() => {
                            Xa(we);
                          })
                          .catch(() => {})));
                } catch (ft) {
                  console.warn("[HT TV] Lỗi reload Shaka manifest:", ft);
                }
              else if (ge.current === "mpegts" && oe.current)
                try {
                  (console.log("[HT TV] Làm mới mpegts stream..."),
                    oe.current.unload(),
                    oe.current.load(),
                    oe.current.play());
                } catch (ft) {
                  console.warn("[HT TV] Lỗi reload mpegts:", ft);
                }
              else we && ((we.src = vt), we.load(), Xa(we));
            }
          }, 4500)));
        try {
          if (vi && Yc.isSupported()) {
            ge.current = "mpegts";
            try {
              Yc.LoggingControl &&
                ((Yc.LoggingControl.enableError = !1),
                (Yc.LoggingControl.enableWarn = !1));
            } catch {}
            const we = ri(In),
              rt = s !== void 0 ? s : !0,
              lt = /4k|uhd|2160/i.test(
                `${(f == null ? void 0 : f.name) || ""} ${(f == null ? void 0 : f.cleanName) || ""}`,
              ),
              vt =
                (f == null ? void 0 : f.group) === "Thể Thao Quốc Tế" ||
                ((f == null ? void 0 : f.group) || "")
                  .toLowerCase()
                  .includes("thể thao") ||
                ((f == null ? void 0 : f.group) || "")
                  .toLowerCase()
                  .includes("sport"),
              ft = {
                lazyLoad: !0,
                lazyLoadMaxDuration: 20,
                lazyLoadRecoverDuration: 10,
                enableStashBuffer: !0,
                stashInitialSize: 128 * 1024,
                autoCleanupSourceBuffer: !0,
                autoCleanupMaxBackwardDuration: 15,
                liveBufferLatencyChasing: rt,
                liveBufferLatencyMaxLatency: 3,
                liveBufferLatencyMinRemain: 1,
                enableWorker: !0,
                reuseRedirectedURL: !0,
                statisticsInfoReportInterval: 1e4,
              },
              Ge = Yc.createPlayer(
                { type: "mpegts", isLive: rt, url: we, cors: !0 },
                ft,
              ),
              Qe = () => {
                try {
                  typeof Ge.recoverMediaError == "function" &&
                    Ge.recoverMediaError();
                } catch {}
              };
            ((Ge.recoverMediaError = Qe),
              (oe.current = Ge),
              Ge.attachMediaElement(pn),
              Ge.load());
            const Rt = Ge.play();
            (Rt &&
              typeof Rt.catch == "function" &&
              Rt.catch((It) => {
                (console.warn("Tự động phát bị chặn hoặc lỗi khởi tạo:", It),
                  Xa(pn));
              }),
              Xa(pn));
            const Dt = () => {
              fe.current === mt && pn.paused && Xa(pn);
            };
            (pn.addEventListener("canplay", Dt),
              pn.addEventListener("loadeddata", Dt),
              pn.addEventListener("progress", Dt),
              pn.addEventListener("timeupdate", Dt),
              ts());
            const Lt = () => {
                if (!(fe.current !== mt || ge.current !== "mpegts")) {
                  try {
                    (Qe(), Xa(pn));
                  } catch {}
                  if (
                    ((On.current += 1),
                    console.warn(
                      `[HT TV] mpegts waiting/stalled (lần ${On.current})`,
                    ),
                    On.current >= 2 && !Pn.current)
                  ) {
                    ((Pn.current = !0),
                      (Yn.current = !0),
                      console.warn(
                        "[HT TV] mpegts stall >= 2 liên tiếp: Tự động nới lỏng latency chasing và tăng đệm an toàn",
                      ));
                    try {
                      Ge._config &&
                        ((Ge._config.liveBufferLatencyChasing = !1),
                        (Ge._config.liveBufferLatencyMaxLatency = 5),
                        (Ge._config.liveBufferLatencyMinRemain = 1),
                        (Ge._config.stashInitialSize = 512 * 1024),
                        (Ge._config.liveSyncMaxLatency = 5),
                        (Ge._config.liveSyncTargetLatency = 2.5));
                    } catch {}
                  }
                  (ii.current && clearTimeout(ii.current),
                    (ii.current = setTimeout(() => {
                      if (fe.current === mt && ge.current === "mpegts") {
                        (console.log(
                          "[HT TV] 30 giây ổn định không nghẽn: Khôi phục cấu hình mặc định",
                        ),
                          (On.current = 0),
                          (Pn.current = !1),
                          (Yn.current = !1));
                        try {
                          Ge._config &&
                            (vt
                              ? ((Ge._config.liveBufferLatencyChasing = !1),
                                (Ge._config.stashInitialSize = 512 * 1024),
                                (Ge._config.liveSync = !1))
                              : ((Ge._config.liveBufferLatencyChasing = !0),
                                (Ge._config.liveBufferLatencyMaxLatency = 1.2),
                                (Ge._config.liveBufferLatencyMinRemain = 0.3),
                                (Ge._config.stashInitialSize = lt
                                  ? 256 * 1024
                                  : 128 * 1024),
                                (Ge._config.liveSyncMaxLatency = 1.2),
                                (Ge._config.liveSyncTargetLatency = 0.6)));
                        } catch {}
                      }
                    }, 3e4)));
                }
              },
              Mt = () => {
                fe.current !== mt ||
                  ge.current !== "mpegts" ||
                  (!Pn.current &&
                    On.current > 0 &&
                    (ii.current && clearTimeout(ii.current),
                    (ii.current = setTimeout(() => {
                      On.current = 0;
                    }, 3e4))));
              };
            (pn.addEventListener("waiting", Lt),
              pn.addEventListener("stalled", Lt),
              pn.addEventListener("playing", Mt));
            const en = () => {
              fe.current !== mt || ge.current !== "mpegts" || Xa(pn);
            };
            (pn.addEventListener("pause", en),
              (re.current = () => {
                (pn.removeEventListener("canplay", Dt),
                  pn.removeEventListener("loadeddata", Dt),
                  pn.removeEventListener("timeupdate", Dt),
                  pn.removeEventListener("progress", Dt),
                  pn.removeEventListener("waiting", Lt),
                  pn.removeEventListener("stalled", Lt),
                  pn.removeEventListener("playing", Mt),
                  pn.removeEventListener("pause", en));
              }),
              Ge.on(Yc.Events.ERROR, (It, rn) => {
                if (fe.current === mt) {
                  if (It === Yc.ErrorTypes.MEDIA_ERROR)
                    try {
                      (Qe(), Xa(pn));
                      return;
                    } catch {}
                  ki(`MPEGTS_ERROR_${It}_${rn}`);
                }
              }));
          } else if (ci && al.Player.isBrowserSupported()) {
            ge.current = "shaka";
            const we = new al.Player();
            he.current = we;
            const rt = Mm(f);
            we.configure({
              preferredAudioCodecs: ["mp4a.40.2", "mp4a", "aac"],
              mediaSource: { useSourceElements: !1 },
              abr: {
                enabled: !0,
                defaultBandwidthEstimate: 12e5,
                switchInterval: 4,
                bandwidthUpgradeTarget: 0.85,
                restrictions: { maxHeight: 1080 },
              },
              streaming: {
                rebufferingGoal: 1,
                bufferingGoal: 4,
                bufferBehind: 10,
                gapDetectionThreshold: 0.5,
                gapPadding: 0,
                gapJumpTimerTime: 0.25,
                stallEnabled: !0,
                stallThreshold: 1,
                stallSkip: 0.5,
                lowLatencyMode: !0,
                inaccurateManifestTolerance: 0.5,
                retryParameters: {
                  maxAttempts: 2,
                  baseDelay: 500,
                  backoffFactor: 1.5,
                  timeout: 3e3,
                },
              },
              manifest: {
                dash: {
                  ignoreMinBufferTime: !0,
                  autoCorrectDrift: !0,
                  initialSegmentLimit: 1,
                },
                defaultPresentationDelay: 4,
              },
            });
            const lt = () => {
              try {
                const Ge = we.getVariantTracks();
                if (!Ge || Ge.length === 0) return;
                const Qe = Ge.filter((Rt) => {
                  const Dt = (Rt.audioCodec || "").toLowerCase(),
                    Lt = (Rt.audioMimeType || "").toLowerCase();
                  return (
                    !(
                      Dt.includes("ac-3") ||
                      Dt.includes("ec-3") ||
                      Dt.includes("ac3") ||
                      Dt.includes("eac3")
                    ) &&
                    (Dt.includes("mp4a") ||
                      Dt.includes("aac") ||
                      Lt.includes("mp4a") ||
                      Lt.includes("aac"))
                  );
                });
                if (Qe.length > 0) {
                  const Rt = Ge.find((Lt) => Lt.active),
                    Dt = (
                      (Rt == null ? void 0 : Rt.audioCodec) || ""
                    ).toLowerCase();
                  if (!Dt.includes("mp4a") && !Dt.includes("aac")) {
                    const Lt =
                      Qe.find(
                        (Mt) => Mt.height === (Rt == null ? void 0 : Rt.height),
                      ) || Qe[0];
                    Lt &&
                      (we.selectVariantTrack(Lt, !0),
                      console.log(
                        `[HT TV] Shaka: Tự động chuyển sang audio track AAC/mp4a (${Lt.audioCodec})`,
                      ));
                  }
                }
              } catch (Ge) {
                console.warn("[HT TV] Lỗi quét audio track Shaka:", Ge);
              }
            };
            (we.addEventListener("trackschanged", lt),
              f.drm && f.drm.type !== "none" && (await $8(we, f.drm)));
            const vt = we.getNetworkingEngine();
            (vt &&
              (vt.registerRequestFilter((Ge, Qe) => {
                const Rt = [
                  "user-agent",
                  "referer",
                  "host",
                  "origin",
                  "cookie",
                  "connection",
                  "sec-ch-ua",
                  "sec-fetch-mode",
                  "sec-fetch-site",
                ];
                if (
                  (Object.keys(Qe.headers).forEach((Dt) => {
                    Rt.includes(Dt.toLowerCase()) && delete Qe.headers[Dt];
                  }),
                  f.headers &&
                    Object.entries(f.headers).forEach(([Dt, Lt]) => {
                      const Mt = Dt.toLowerCase();
                      !Rt.includes(Mt) && Lt && (Qe.headers[Dt] = String(Lt));
                    }),
                  In.includes("?"))
                ) {
                  const Dt = In.substring(In.indexOf("?") + 1),
                    Lt = new URLSearchParams(Dt),
                    Mt = [
                      "token",
                      "expires",
                      "play_token",
                      "vid",
                      "id",
                      "mac",
                      "stream",
                      "extension",
                      "auth",
                    ];
                  Qe.uris.forEach((en, It) => {
                    try {
                      if (
                        en.startsWith("http://") ||
                        en.startsWith("https://") ||
                        en.startsWith("/api/proxy") ||
                        en.startsWith("/api/stream-proxy")
                      ) {
                        const rn = new URL(en, window.location.origin);
                        let dn = !1;
                        (Mt.forEach((hi) => {
                          Lt.has(hi) &&
                            !rn.searchParams.has(hi) &&
                            (rn.searchParams.set(hi, Lt.get(hi)), (dn = !0));
                        }),
                          dn && (Qe.uris[It] = rn.href));
                      }
                    } catch {}
                  });
                }
              }),
              vt.registerResponseFilter((Ge, Qe) => {
                if (Ge === 0 && Qe.data)
                  try {
                    const Rt = new TextDecoder("utf-8"),
                      Dt =
                        Qe.data instanceof ArrayBuffer
                          ? new Uint8Array(Qe.data)
                          : new Uint8Array(
                              Qe.data.buffer,
                              Qe.data.byteOffset,
                              Qe.data.byteLength,
                            ),
                      Lt = Rt.decode(Dt.subarray(0, 400)).toLowerCase();
                    if (
                      Lt.includes("<html") ||
                      Lt.includes("<!doctype") ||
                      Lt.includes("đăng ký gói") ||
                      Lt.includes("vui lòng")
                    )
                      throw new al.util.Error(
                        al.util.Error.Severity.CRITICAL,
                        al.util.Error.Category.MANIFEST,
                        al.util.Error.Code.UNABLE_TO_GUESS_MANIFEST_TYPE,
                        "Upstream returned HTML error page instead of valid manifest",
                      );
                  } catch (Rt) {
                    if (Rt instanceof al.util.Error) throw Rt;
                  }
              })),
              we.addEventListener("error", (Ge) => {
                var Rt, Dt, Lt;
                const Qe = Ge.detail;
                if (
                  (Qe && (Qe.handled = !0),
                  typeof Ge.preventDefault == "function" && Ge.preventDefault(),
                  typeof Ge.stopPropagation == "function" &&
                    Ge.stopPropagation(),
                  !(
                    (Qe == null ? void 0 : Qe.code) ===
                      ((Lt =
                        (Dt = (Rt = al.util) == null ? void 0 : Rt.Error) ==
                        null
                          ? void 0
                          : Dt.Code) == null
                        ? void 0
                        : Lt.LOAD_INTERRUPTED) ||
                    (Qe == null ? void 0 : Qe.code) === 7e3 ||
                    fe.current !== mt
                  ))
                ) {
                  if (
                    (Qe == null ? void 0 : Qe.code) === 3015 ||
                    (Qe == null ? void 0 : Qe.code) === 3014 ||
                    (Qe == null ? void 0 : Qe.code) === 3018 ||
                    String((Qe == null ? void 0 : Qe.message) || "").includes(
                      "3015",
                    )
                  ) {
                    (console.warn(
                      "[HT TV] Shaka MediaSource lỗi 3015 (không tương thích container TS), tự động chuyển fallback sang HLS.js:",
                      Qe,
                    ),
                      (f.format = "hls"),
                      (f.drm = void 0),
                      ki("SHAKA_FALLBACK_TO_HLS_3015"));
                    return;
                  }
                  (console.warn(
                    `[HT TV] Shaka error event (${Qe == null ? void 0 : Qe.code}):`,
                    Qe,
                  ),
                    ki(
                      `SHAKA_ERROR_${(Qe == null ? void 0 : Qe.code) || "UNKNOWN"}`,
                    ));
                }
              }));
            const ft = async (Ge, Qe, Rt) => {
              var Lt, Mt, en;
              Le.current += 1;
              const Dt = Le.current;
              try {
                if (
                  (Qe.pause(),
                  await Ge.unload().catch(() => {}),
                  Dt !== Le.current ||
                    fe.current !== mt ||
                    (Ge.getMediaElement() !== Qe && (await Ge.attach(Qe)),
                    Dt !== Le.current || fe.current !== mt) ||
                    (await Ge.load(Rt), Dt !== Le.current || fe.current !== mt))
                )
                  return;
                (lt(), (Qe.muted = !0));
                try {
                  (await Qe.play(),
                    Dt === Le.current && fe.current === mt && (Qe.muted = !1));
                } catch {
                  Xa(Qe);
                }
                Dt === Le.current && fe.current === mt && ts();
              } catch (It) {
                if (
                  (It && typeof It == "object" && (It.handled = !0),
                  (It == null ? void 0 : It.code) ===
                    ((en =
                      (Mt = (Lt = al.util) == null ? void 0 : Lt.Error) == null
                        ? void 0
                        : Mt.Code) == null
                      ? void 0
                      : en.LOAD_INTERRUPTED) ||
                    (It == null ? void 0 : It.code) === 7e3 ||
                    String((It == null ? void 0 : It.message) || It).includes(
                      "7000",
                    ) ||
                    String((It == null ? void 0 : It.message) || It).includes(
                      "LOAD_INTERRUPTED",
                    ) ||
                    Dt !== Le.current ||
                    fe.current !== mt)
                )
                  return;
                if (
                  (It == null ? void 0 : It.code) === 3015 ||
                  (It == null ? void 0 : It.code) === 3014 ||
                  (It == null ? void 0 : It.code) === 3018 ||
                  String((It == null ? void 0 : It.message) || "").includes(
                    "3015",
                  )
                ) {
                  (console.warn(
                    "[HT TV] Lỗi Shaka 3015 khi nạp, chuyển sang engine Hls.js:",
                    It,
                  ),
                    (f.format = "hls"),
                    (f.drm = void 0),
                    ki("SHAKA_FALLBACK_TO_HLS_3015"));
                  return;
                }
                (console.warn("[HT TV] Lỗi nạp luồng Shaka:", It),
                  ki(
                    `SHAKA_LOAD_${(It == null ? void 0 : It.code) || "ERROR"}`,
                  ));
              }
            };
            ((Je.current = ft), await ft(we, pn, In));
          } else if (
            ys.isSupported() &&
            !vi &&
            (Oi ||
              In.includes("/api/proxy") ||
              In.includes("/api/stream-proxy"))
          ) {
            ge.current = "hls";
            const rt =
                f.group === "Thể Thao Quốc Tế" ||
                (f.group || "").toLowerCase().includes("thể thao") ||
                (f.group || "").toLowerCase().includes("sport") ||
                Mm(f),
              lt = new ys({
                enableWorker: !0,
                lowLatencyMode: !1,
                abrEwmaDefaultEstimate: 35e5,
                abrBandWidthFactor: 0.85,
                abrBandWidthUpFactor: 0.7,
                manifestLoadingTimeOut: 12e3,
                manifestLoadingMaxRetry: 4,
                manifestLoadingRetryDelay: 800,
                levelLoadingTimeOut: 12e3,
                levelLoadingMaxRetry: 4,
                levelLoadingRetryDelay: 800,
                fragLoadingTimeOut: 18e3,
                fragLoadingMaxRetry: 4,
                fragLoadingRetryDelay: 800,
                backBufferLength: 15,
                maxBufferLength: 30,
                maxMaxBufferLength: 60,
                maxBufferSize: 64 * 1024 * 1024,
                liveSyncDurationCount: 3,
                liveMaxLatencyDurationCount: 8,
                xhrSetup: (ft) => {
                  if (((ft.withCredentials = !1), f.headers)) {
                    const Ge = [
                      "user-agent",
                      "referer",
                      "host",
                      "origin",
                      "cookie",
                    ];
                    Object.entries(f.headers).forEach(([Qe, Rt]) => {
                      if (!Ge.includes(Qe.toLowerCase()) && Rt)
                        try {
                          ft.setRequestHeader(Qe, String(Rt));
                        } catch {}
                    });
                  }
                },
              });
            ((te.current = lt),
              (lt.currentLevel = -1),
              lt.attachMedia(pn),
              lt.loadSource(In));
            const vt = () => {
              var ft, Ge;
              try {
                const Qe = lt.audioTracks;
                if (!Qe || Qe.length <= 1) return;
                const Rt = lt.audioTracks[lt.audioTrack],
                  Dt = (
                    (Rt == null ? void 0 : Rt.audioCodec) ||
                    ((ft = Rt == null ? void 0 : Rt.attrs) == null
                      ? void 0
                      : ft.CODECS) ||
                    ""
                  ).toLowerCase();
                if (!(
                  Dt.includes("ac-3") ||
                  Dt.includes("ec-3") ||
                  Dt.includes("ac3") ||
                  Dt.includes("eac3") ||
                  ((Rt == null ? void 0 : Rt.name) || "")
                    .toLowerCase()
                    .includes("5.1")
                ))
                  return;
                let Mt = -1;
                for (let en = 0; en < Qe.length; en++) {
                  const It = Qe[en],
                    rn = (
                      It.audioCodec ||
                      ((Ge = It.attrs) == null ? void 0 : Ge.CODECS) ||
                      ""
                    ).toLowerCase(),
                    dn = (It.name || "").toLowerCase();
                  if (
                    !(
                      rn.includes("ac-3") ||
                      rn.includes("ec-3") ||
                      rn.includes("ac3") ||
                      rn.includes("eac3") ||
                      dn.includes("5.1")
                    ) &&
                    (rn.includes("mp4a") ||
                      rn.includes("aac") ||
                      dn.includes("aac") ||
                      dn.includes("stereo") ||
                      dn.includes("tiếng việt") ||
                      dn.includes("vietnamese"))
                  ) {
                    Mt = en;
                    break;
                  }
                }
                Mt !== -1 &&
                  lt.audioTrack !== Mt &&
                  ((lt.audioTrack = Mt),
                  console.log(
                    `[HT TV] Hls.js: Tự động chuyển sang audio track AAC khả dụng index ${Mt}`,
                  ));
              } catch (Qe) {
                console.warn("[HT TV] Lỗi quét audio track Hls.js:", Qe);
              }
            };
            (lt.on(ys.Events.AUDIO_TRACKS_UPDATED, () => {
              (vt(), S.current && (S.current.muted = !1));
            }),
              lt.on(ys.Events.MEDIA_ATTACHED, () => {
                fe.current === mt && !lt.url && lt.loadSource(In);
              }),
              lt.on(ys.Events.MANIFEST_PARSED, () => {
                fe.current === mt &&
                  (vt(),
                  S.current && Wi.current && (S.current.muted = !1),
                  Xa(pn),
                  ts());
              }),
              lt.on(ys.Events.ERROR, (ft, Ge) => {
                var Qe;
                if (Ge.details === ys.ErrorDetails.BUFFER_STALLED_ERROR) {
                  console.warn(
                    "[HT TV] HLS phát hiện nghẽn buffer tạm thời (BUFFER_STALLED_ERROR) - Tiếp tục chờ nạp đệm",
                  );
                  const Rt = Date.now();
                  if (
                    ((vn.current = [
                      ...vn.current.filter((Dt) => Rt - Dt < 1e4),
                      Rt,
                    ]),
                    vn.current.length >= 3)
                  ) {
                    if (
                      (console.warn(
                        "[HT TV] HLS nghẽn >= 3 lần trong 10s: Tự động hạ 1 mức resolution",
                      ),
                      (Yn.current = !0),
                      lt.levels && lt.levels.length > 1)
                    ) {
                      const Dt =
                          lt.currentLevel >= 0 ? lt.currentLevel : lt.loadLevel,
                        Lt = Math.max(0, Dt - 1);
                      (console.warn(
                        `[HT TV] HLS hạ resolution level: ${Dt} -> ${Lt}`,
                      ),
                        (lt.nextLevel = Lt));
                    }
                    (ii.current && clearTimeout(ii.current),
                      (ii.current = setTimeout(() => {
                        if (fe.current === mt && ge.current === "hls") {
                          (console.log(
                            "[HT TV] HLS 30s không nghẽn: Trả lại ABR Auto",
                          ),
                            (Yn.current = !1),
                            (vn.current = []));
                          try {
                            lt.currentLevel = -1;
                          } catch {}
                        }
                      }, 3e4)));
                  }
                }
                if (Ge.fatal) {
                  if (fe.current !== mt) return;
                  if (Ge.type === ys.ErrorTypes.MEDIA_ERROR)
                    try {
                      (console.warn(
                        "[HT TV] HLS fatal Media Error - Đang khôi phục media pipeline...",
                      ),
                        lt.recoverMediaError());
                      return;
                    } catch {}
                  if (
                    (In.includes(".ts") ||
                      In.includes("extension=ts") ||
                      In.includes("mac=") ||
                      In.includes("play_token=") ||
                      In.includes("live.php")) &&
                    Yc.isSupported() &&
                    (Ge.details === ys.ErrorDetails.MANIFEST_PARSING_ERROR ||
                      Ge.details === ys.ErrorDetails.MANIFEST_LOAD_ERROR ||
                      Ge.type === ys.ErrorTypes.NETWORK_ERROR)
                  ) {
                    (console.warn(
                      "[HT TV] HLS.js gặp lỗi manifest trên luồng TS - Chuyển sang mpegts.js transmuxing...",
                    ),
                      ki("HLS_MANIFEST_TO_MPEGTS"));
                    return;
                  }
                  ki(
                    `HLS_FATAL_${Ge.type}`,
                    (Qe = Ge.response) == null ? void 0 : Qe.code,
                  );
                }
              }));
          } else {
            if (
              (In.includes(".ts") ||
                In.includes("extension=ts") ||
                In.includes("mac=") ||
                In.includes("play_token=") ||
                In.includes("live.php")) &&
              Yc.isSupported()
            ) {
              (console.warn(
                "[HT TV] Luồng TS trên trình duyệt - Kích hoạt mpegts.js transmuxer",
              ),
                ki("MPEGTS_FALLBACK"));
              return;
            }
            ((ge.current = "native"),
              (pn.src = In),
              pn.addEventListener(
                "loadedmetadata",
                () => {
                  fe.current === mt && (pn.play().catch(() => {}), ts());
                },
                { once: !0 },
              ),
              pn.addEventListener(
                "error",
                () => {
                  fe.current === mt && ki("NATIVE_VIDEO_ERROR");
                },
                { once: !0 },
              ));
          }
        } catch (we) {
          fe.current === mt &&
            ki(
              `INIT_EXCEPTION_${(we == null ? void 0 : we.message) || "UNKNOWN"}`,
            );
        }
      },
      [f, gi, wi, Ri, ri],
    );
  Pt.useEffect(() => {
    fe.current += 1;
    const Ze = fe.current;
    if (
      ((Et.current = 0),
      (Ue.current = 0),
      (at.current = !1),
      (St.current = !1),
      k(null),
      R(!0),
      z(!1),
      Ee.current && (clearTimeout(Ee.current), (Ee.current = null)),
      f)
    ) {
      (S.current && (S.current.muted = !1),
        Y.current && clearTimeout(Y.current));
      const mt = Mm(f);
      ((Y.current = setTimeout(
        async () => {
          fe.current === Ze &&
            !at.current &&
            (await wi(), R(!1), k("Nguồn phát không khả dụng"), $t());
        },
        f.group === "Thể Thao Quốc Tế" || mt ? 35e3 : 25e3,
      )),
        _r(0, Ze));
    } else R(!1);
    return () => {
      ((fe.current += 1),
        Y.current && (clearTimeout(Y.current), (Y.current = null)),
        bt.current && (clearTimeout(bt.current), (bt.current = null)),
        At.current && (clearTimeout(At.current), (At.current = null)),
        wi().catch(() => {}));
    };
  }, [f == null ? void 0 : f.id, f == null ? void 0 : f.url, P, _r, wi, $t]);
  const Dr = Pt.useCallback(async () => {
    const Ze =
      document.getElementById("ht-tv-app-root") ||
      E.current ||
      document.documentElement;
    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (Ze) {
          Ze.requestFullscreen
            ? await Ze.requestFullscreen()
            : Ze.webkitRequestFullscreen
              ? await Ze.webkitRequestFullscreen()
              : Ze.msRequestFullscreen
                ? await Ze.msRequestFullscreen()
                : S.current &&
                  S.current.webkitEnterFullscreen &&
                  S.current.webkitEnterFullscreen();
          const mt = screen == null ? void 0 : screen.orientation;
          if (mt && typeof mt.lock == "function")
            await mt.lock("landscape").catch((cn) => {
              console.warn("[HT TV] Orientation lock failed:", cn);
            });
          else if (screen.lockOrientation)
            try {
              screen.lockOrientation("landscape");
            } catch {}
          (X(!0),
            setTimeout(() => {
              de() ? z(!0) : z(!1);
            }, 300));
        }
      } else {
        const mt = screen == null ? void 0 : screen.orientation;
        if (mt && typeof mt.unlock == "function")
          try {
            mt.unlock();
          } catch {}
        else if (screen.unlockOrientation)
          try {
            screen.unlockOrientation();
          } catch {}
        (document.exitFullscreen
          ? await document.exitFullscreen()
          : document.webkitExitFullscreen
            ? await document.webkitExitFullscreen()
            : document.msExitFullscreen
              ? await document.msExitFullscreen()
              : S.current &&
                S.current.webkitExitFullscreen &&
                S.current.webkitExitFullscreen(),
          X(!1),
          z(!1));
      }
    } catch (mt) {
      if ((console.error(mt), S.current && S.current.webkitEnterFullscreen))
        try {
          S.current.webkitEnterFullscreen();
        } catch {}
    }
  }, [de]);
  (Pt.useCallback(async () => {
    !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !se &&
      (await Dr());
  }, [se, Dr]),
    Pt.useCallback(async () => {
      (document.fullscreenElement || document.webkitFullscreenElement || se) &&
        (await Dr());
    }, [se, Dr]),
    Pt.useEffect(() => {
      const Ze = () => {
          const fn = de();
          if ((le(fn), !fn)) z(!1);
          else {
            const Ct = !!(
              document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.mozFullScreenElement ||
              document.msFullscreenElement
            );
            (!(
              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent,
              ) ||
              (window.innerWidth < 1024 &&
                ("ontouchstart" in window || navigator.maxTouchPoints > 0))
            ) ||
              Ct) &&
              z(!0);
          }
        },
        mt = () => {
          const fn = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
          );
          if ((X(fn), fn)) de() ? z(!0) : z(!1);
          else {
            z(!1);
            try {
              const Ct = screen == null ? void 0 : screen.orientation;
              Ct && typeof Ct.unlock == "function"
                ? Ct.unlock()
                : screen.unlockOrientation && screen.unlockOrientation();
            } catch {}
          }
        };
      (window.addEventListener("resize", Ze),
        window.addEventListener("orientationchange", Ze),
        document.addEventListener("fullscreenchange", mt),
        document.addEventListener("webkitfullscreenchange", mt));
      const cn = screen == null ? void 0 : screen.orientation;
      cn &&
        typeof cn.addEventListener == "function" &&
        cn.addEventListener("change", Ze);
      const Ci = S.current,
        hn = () => {
          (X(!0), de() && z(!0));
        },
        zt = () => {
          (X(!1), z(!1));
          try {
            const fn = screen == null ? void 0 : screen.orientation;
            fn && typeof fn.unlock == "function"
              ? fn.unlock()
              : screen.unlockOrientation && screen.unlockOrientation();
          } catch {}
        };
      return (
        Ci &&
          (Ci.addEventListener("webkitbeginfullscreen", hn),
          Ci.addEventListener("webkitendfullscreen", zt)),
        () => {
          (window.removeEventListener("resize", Ze),
            window.removeEventListener("orientationchange", Ze),
            document.removeEventListener("fullscreenchange", mt),
            document.removeEventListener("webkitfullscreenchange", mt),
            cn &&
              typeof cn.removeEventListener == "function" &&
              cn.removeEventListener("change", Ze),
            Ci &&
              (Ci.removeEventListener("webkitbeginfullscreen", hn),
              Ci.removeEventListener("webkitendfullscreen", zt)));
        }
      );
    }, [de]));
  const cs = () => {
      if (S.current && S.current.muted)
        try {
          S.current.muted = !1;
        } catch {}
      (Be.current && (clearTimeout(Be.current), (Be.current = null)),
        Xe.current && (clearTimeout(Xe.current), (Xe.current = null)),
        Y.current && (clearTimeout(Y.current), (Y.current = null)),
        At.current && (clearTimeout(At.current), (At.current = null)),
        bt.current && (clearTimeout(bt.current), (bt.current = null)),
        Te.current && (clearTimeout(Te.current), (Te.current = null)),
        Ie.current && (clearTimeout(Ie.current), (Ie.current = null)),
        R(!1),
        k(null),
        (at.current = !0),
        (Ue.current = 0),
        (Et.current = 0));
      const Ze = Date.now() - Gt.current;
      (G && Xx.recordSuccess(G, Math.max(Ze, 200)), o && o());
    },
    ll = () => {
      !L &&
        at.current &&
        (R(!0),
        At.current && clearTimeout(At.current),
        (At.current = setTimeout(() => {
          const Ze = S.current;
          Ze &&
            Ze.readyState < 3 &&
            at.current &&
            !L &&
            (console.warn(
              "[HT TV] Buffering kéo dài 12s không nạp thêm dữ liệu -> Chuyển sang candidate nguồn tiếp theo",
            ),
            un.current && un.current("BUFFERING_STALL_12S"));
        }, 12e3)));
    },
    En = () => {
      if (!L) {
        (At.current && (clearTimeout(At.current), (At.current = null)),
          Te.current && (clearTimeout(Te.current), (Te.current = null)),
          Ie.current && (clearTimeout(Ie.current), (Ie.current = null)));
        const Ze = S.current;
        Ze && Ze.currentTime > 0.05 && R(!1);
      }
    };
  return (
    Pt.useCallback(() => {
      if (gi.length <= 1) return;
      const Ze = (Ye.current + 1) % gi.length;
      (console.log(
        `[HT TV] Chuyển đổi nguồn phát thủ công: Nguồn ${Ze + 1}/${gi.length}`,
      ),
        _r(Ze, fe.current));
    }, [gi.length, _r]),
    Pt.useEffect(() => {
      const Ze = setInterval(() => {
        const mt = S.current;
        if (!mt) return;
        const { bufferAhead: cn } = PP(mt);
        (!mt.paused &&
          mt.readyState >= 2 &&
          (cn < 1.5 && mt.playbackRate !== 0.97
            ? (mt.playbackRate = 0.97)
            : cn >= 2.5 && cn < 18 && mt.playbackRate !== 1
              ? (mt.playbackRate = 1)
              : cn >= 18 &&
                mt.playbackRate !== 1.03 &&
                (mt.playbackRate = 1.03)),
          mt.paused && !A && !L && at.current && Xa(mt));
      }, 1e3);
      return () => clearInterval(Ze);
    }, [A, L]),
    Jt.jsxs("div", {
      ref: E,
      id: "video-player-root",
      className:
        "relative w-full h-full bg-black overflow-hidden select-none cursor-pointer",
      onClick: c,
      children: [
        Jt.jsx("video", {
          ref: S,
          id: "ht-tv-main-video",
          className: `w-full h-full bg-black outline-none border-0 ${W && w ? "object-fill" : "object-contain"}`,
          style: {
            backgroundColor: "#000000",
            outline: "none",
            border: "none",
          },
          onPlaying: cs,
          onWaiting: ll,
          onCanPlay: En,
          onTimeUpdate: () => {
            S.current && S.current.currentTime > 0.05 && A && R(!1);
          },
          playsInline: !0,
          autoPlay: !0,
          muted: !0,
          controls: !1,
        }),
        Jt.jsx("div", {
          id: "video-screen-tap-area",
          className: "absolute inset-0 z-10 cursor-pointer",
          onClick: (Ze) => {
            if ((Ze.stopPropagation(), (Wi.current = !0), S.current)) {
              if (S.current.muted)
                try {
                  S.current.muted = !1;
                } catch {}
              S.current.paused && S.current.play().catch(() => {});
            }
            c && c();
          },
        }),
        (() => {
          const Ze = (
              (f == null ? void 0 : f.cleanName) ||
              (f == null ? void 0 : f.name) ||
              ""
            ).toLowerCase(),
            mt =
              Ze.includes("on music") ||
              Ze.includes("htvc ca nhạc") ||
              Ze.includes("htvc ca nhac");
          return ((f == null ? void 0 : f.isMusic) ||
            (f == null ? void 0 : f.group) === "Nghe Nhạc") &&
            !mt &&
            !L
            ? Jt.jsxs("div", {
                id: "music-visualizer-overlay",
                className:
                  "absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-8 z-20 overflow-hidden",
                children: [
                  Jt.jsx("div", {
                    className:
                      "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70 pointer-events-none",
                  }),
                  Jt.jsxs("div", {
                    className: "relative z-10 flex items-center gap-3",
                    children: [
                      Jt.jsx("div", {
                        className:
                          "w-10 h-10 rounded-xl bg-pink-600/30 border border-pink-500/40 backdrop-blur-md flex items-center justify-center shadow-lg shadow-pink-950/40",
                        children: Jt.jsx(f9, {
                          className: "w-5 h-5 text-pink-400 animate-pulse",
                        }),
                      }),
                      Jt.jsxs("div", {
                        children: [
                          Jt.jsx("span", {
                            className:
                              "text-[10px] font-mono font-bold text-pink-400 uppercase tracking-widest block",
                            children: "ĐANG PHÁT NHẠC",
                          }),
                          Jt.jsx("span", {
                            className:
                              "text-sm font-bold text-white drop-shadow",
                            children: f == null ? void 0 : f.cleanName,
                          }),
                        ],
                      }),
                    ],
                  }),
                  Jt.jsxs("div", {
                    className:
                      "relative z-10 flex flex-col items-center justify-center my-auto",
                    children: [
                      Jt.jsx("div", {
                        className:
                          "absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-pink-600/25 via-purple-600/20 to-red-600/15 blur-3xl animate-pulse-aura pointer-events-none",
                      }),
                      Jt.jsxs("div", {
                        className:
                          "relative w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-neutral-950 border-4 border-neutral-800 shadow-2xl flex items-center justify-center animate-spin-slow",
                        children: [
                          Jt.jsx("div", {
                            className:
                              "absolute inset-2.5 rounded-full border border-neutral-800/80",
                          }),
                          Jt.jsx("div", {
                            className:
                              "absolute inset-5 rounded-full border border-neutral-800/60",
                          }),
                          Jt.jsx("div", {
                            className:
                              "absolute inset-8 rounded-full border border-neutral-800/50",
                          }),
                          Jt.jsx("div", {
                            className:
                              "absolute inset-11 rounded-full border border-neutral-800/40",
                          }),
                          Jt.jsxs("div", {
                            className:
                              "w-18 h-18 sm:w-22 sm:h-22 rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-red-500 flex items-center justify-center shadow-inner border-2 border-white/30 relative overflow-hidden",
                            children: [
                              f != null && f.logo
                                ? Jt.jsx("img", {
                                    src: f.logo,
                                    alt: f.cleanName,
                                    className:
                                      "w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow rounded-full",
                                    onError: (Ci) => {
                                      Ci.currentTarget.style.display = "none";
                                    },
                                  })
                                : Jt.jsx(d9, {
                                    className: "w-7 h-7 text-white drop-shadow",
                                  }),
                              Jt.jsx("div", {
                                className:
                                  "absolute w-3 h-3 rounded-full bg-neutral-950 border border-white/40",
                              }),
                            ],
                          }),
                        ],
                      }),
                      Jt.jsx("p", {
                        className:
                          "mt-4 text-xs sm:text-sm font-semibold text-neutral-300 tracking-wide drop-shadow text-center",
                        children: f == null ? void 0 : f.cleanName,
                      }),
                    ],
                  }),
                  Jt.jsx("div", {
                    className:
                      "relative z-10 flex items-end justify-center gap-1 sm:gap-1.5 pb-4",
                    children: [
                      35, 70, 50, 85, 60, 95, 45, 90, 65, 80, 55, 100, 48, 75,
                      88, 62, 92, 40, 78, 58, 85, 45, 95, 60, 80, 50, 70, 35,
                    ].map((Ci, hn) =>
                      Jt.jsx(
                        "span",
                        {
                          className:
                            "w-1 sm:w-1.5 bg-gradient-to-t from-red-600 via-pink-500 to-rose-400 rounded-full",
                          style: {
                            height: `${Ci}%`,
                            maxHeight: "48px",
                            animation: `musicBarPulse ${0.5 + (hn % 5) * 0.12}s ease-in-out infinite alternate`,
                            animationDelay: `${(hn % 7) * 0.08}s`,
                          },
                        },
                        hn,
                      ),
                    ),
                  }),
                ],
              })
            : null;
        })(),
        Jt.jsx("div", {
          id: "channel-loading-overlay",
          className: `absolute inset-0 z-20 bg-black pointer-events-none transition-opacity duration-300 ease-out ${A ? "opacity-100" : "opacity-0"}`,
        }),
        Jt.jsx("button", {
          id: "fullscreen-toggle-btn",
          type: "button",
          title: se ? "Thu nhỏ màn hình" : "Toàn màn hình",
          "aria-label": se ? "Thu nhỏ màn hình" : "Toàn màn hình",
          onClick: (Ze) => {
            (Ze.stopPropagation(), Dr());
          },
          className:
            "absolute top-4 right-4 z-30 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 active:scale-95 text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/60 group",
          children: se
            ? Jt.jsx(u9, {
                className:
                  "w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110",
              })
            : Jt.jsx(o9, {
                className:
                  "w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110",
              }),
        }),
      ],
    })
  );
};
