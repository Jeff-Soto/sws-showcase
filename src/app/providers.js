"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

function createEmotionCache() {
  const cache = createCache({ key: "mui", prepend: true });
  cache.compat = true;
  return cache;
}

export default function Providers({ children }) {
  const cache = React.useMemo(() => createEmotionCache(), []);

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

