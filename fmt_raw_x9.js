function x9({
  enabled: g = !0,
  onSwipeRight: i,
  onSwipeLeft: s,
  onSwipeUp: o,
  onSwipeDown: c,
}) {
  const p = Pt.useRef(null);
  Pt.useEffect(() => {
    if (!g) return;
    const v = (E) => {
        E.touches.length === 1 && window.scrollY;
      },
      f = (E) => {
        if (!g) return;
        const A = E.target;
        if (
          A &&
          A.closest(
            "#channel-drawer-root, #drawer-channels-list, aside, button",
          )
        ) {
          p.current = null;
          return;
        }
        E.touches.length === 1 &&
          (p.current = {
            x: E.touches[0].clientX,
            y: E.touches[0].clientY,
            time: Date.now(),
          });
      },
      S = (E) => {
        if (!p.current) return;
        if (E.changedTouches.length !== 1) {
          p.current = null;
          return;
        }
        const A = {
            x: E.changedTouches[0].clientX,
            y: E.changedTouches[0].clientY,
            time: Date.now(),
          },
          R = A.x - p.current.x,
          L = A.y - p.current.y,
          k = A.time - p.current.time;
        p.current = null;
        const P = 50;
        k > 600 ||
          (Math.abs(R) > Math.abs(L)
            ? Math.abs(R) > P && (R > 0 ? i() : s())
            : Math.abs(L) > P && (L < 0 ? o() : c()));
      };
    return (
      window.addEventListener("touchstart", f, { passive: !0 }),
      window.addEventListener("touchend", S, { passive: !0 }),
      window.addEventListener("touchmove", v, { passive: !0 }),
      () => {
        (window.removeEventListener("touchstart", f),
          window.removeEventListener("touchend", S),
          window.removeEventListener("touchmove", v));
      }
    );
  }, [g, i, s, o, c]);
}
