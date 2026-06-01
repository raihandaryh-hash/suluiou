import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scroll behavior:
 * - PUSH / REPLACE (new navigation via CTA/link): scroll to top
 * - POP (back/forward): preserve scroll position restored by the browser
 *
 * Also disables the browser's automatic scroll restoration only for PUSH so
 * fresh navigations always start at the top, while letting us restore manually
 * on POP.
 */
const scrollPositions = new Map<string, number>();

const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  const navigationType = useNavigationType();
  const key = pathname + search;

  // Save scroll position before navigating away
  useEffect(() => {
    const handler = () => {
      scrollPositions.set(key, window.scrollY);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      scrollPositions.set(key, window.scrollY);
      window.removeEventListener("scroll", handler);
    };
  }, [key]);

  useEffect(() => {
    if (navigationType === "POP") {
      const saved = scrollPositions.get(key) ?? 0;
      // Wait a frame for content to render before restoring
      requestAnimationFrame(() => {
        window.scrollTo({ top: saved, left: 0 });
      });
    } else {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [key, navigationType]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return null;
};

export default ScrollToTop;
