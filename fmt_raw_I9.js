function I9() {
  const [g, i] = Pt.useState([]),
    [s, o] = Pt.useState(0),
    [c, p] = Pt.useState(null),
    [v, f] = Pt.useState(!0),
    [S, E] = Pt.useState(!1),
    [A, R] = Pt.useState(!0),
    [L, k] = Pt.useState({ buffer: "", matchedChannel: null, isVisible: !1 }),
    P = Pt.useRef(null);
  Pt.useEffect(() => {
    let w = !0;
    async function le() {
      try {
        const { channels: he } = await Z8();
        if (!w) return;
        if ((i(he), R(!1), he.length > 0)) {
          const te = he[0];
          (p(te), o(0));
        }
      } catch (he) {
        (console.warn("Playlist initialization failed:", he), R(!1));
      }
    }
    return (
      le(),
      () => {
        ((w = !1), P.current && clearTimeout(P.current));
      }
    );
  }, []);
  const U = Pt.useCallback((w) => {
      (p(w), P.current && (clearTimeout(P.current), (P.current = null)), f(!1));
    }, []),
    G = Pt.useCallback(() => {}, []),
    K = Pt.useCallback(() => {
      (P.current && (clearTimeout(P.current), (P.current = null)),
        f((w) => !w));
    }, []),
    W = Pt.useCallback(() => {
      g.length !== 0 &&
        o((w) => {
          const le = (w + 1) % g.length;
          return (U(g[le]), le);
        });
    }, [g, U]),
    z = Pt.useCallback(() => {
      g.length !== 0 &&
        o((w) => {
          const le = (w - 1 + g.length) % g.length;
          return (U(g[le]), le);
        });
    }, [g, U]),
    se = Pt.useRef(0),
    X = Pt.useCallback(() => {
      (E(!0),
        setTimeout(() => {
          E(!1);
        }, 2e3));
    }, []),
    de = Pt.useCallback(() => {
      window.AndroidBridge && typeof window.AndroidBridge.exitApp == "function"
        ? window.AndroidBridge.exitApp()
        : window.close();
    }, []);
  return (
    Pt.useEffect(() => {
      window.history.pushState({ page: "ht-tv" }, "", window.location.href);
      const w = () => {
        if (
          (window.history.pushState(
            { page: "ht-tv" },
            "",
            window.location.href,
          ),
          v)
        ) {
          f(!1);
          return;
        }
        const le = Date.now();
        le - se.current < 2e3 ? de() : ((se.current = le), X());
      };
      return (
        window.addEventListener("popstate", w),
        () => {
          window.removeEventListener("popstate", w);
        }
      );
    }, [v, de, X]),
    A9({
      isDrawerOpen: v,
      setIsDrawerOpen: f,
      channels: g,
      focusedChannelIndex: s,
      setFocusedChannelIndex: o,
      onSelectChannel: U,
      onShowExitToast: X,
      onExitApp: de,
      onNumberInput: (w, le, he) => {
        k({ buffer: w, matchedChannel: le, isVisible: he });
      },
    }),
    x9({
      enabled: !v,
      onSwipeRight: z,
      onSwipeLeft: W,
      onSwipeUp: W,
      onSwipeDown: z,
    }),
    Jt.jsxs("main", {
      id: "ht-tv-app-root",
      className:
        "relative w-full h-full min-h-screen bg-black overflow-hidden select-none",
      children: [
        Jt.jsx(T9, {
          channel: c,
          onPlaybackSuccess: G,
          onToggleDrawer: K,
          onAutoNextChannel: W,
        }),
        Jt.jsx(E9, {
          inputBuffer: L.buffer,
          matchedChannel: L.matchedChannel,
          isVisible: L.isVisible,
        }),
        Jt.jsx(S9, {
          isOpen: v,
          channels: g,
          focusedChannelIndex: s,
          currentChannel: c,
          onSelectChannel: U,
          onHoverChannel: o,
          onClose: () => f(!1),
        }),
        S &&
          Jt.jsx("div", {
            id: "exit-toast",
            className:
              "absolute bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-neutral-900/90 border border-white/20 text-white text-xs font-semibold rounded-full shadow-2xl backdrop-blur-md animate-fade-in",
            children: "Nhấn Back một lần nữa để thoát HT TV",
          }),
      ],
    })
  );
}
H8.createRoot(document.getElementById("root")).render(
  Jt.jsx(Pt.StrictMode, { children: Jt.jsx(I9, {}) }),
);
