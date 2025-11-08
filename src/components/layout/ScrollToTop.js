"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.body?.classList.remove("scroll-visible");
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateScrollClass = () => {
      if (window.scrollY > 0) {
        document.body.classList.add("scroll-visible");
      } else {
        document.body.classList.remove("scroll-visible");
      }
    };

    updateScrollClass();
    window.addEventListener("scroll", updateScrollClass, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollClass);
    };
  }, []);

  return null;
}

