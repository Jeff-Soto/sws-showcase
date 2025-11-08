"use client";

import Button from "@mui/material/Button";
import NextLink from "next/link";

export default function GradientButton({
  sx,
  href,
  target,
  rel,
  prefetch,
  ...rest
}) {
  const linkProps = href
    ? {
        component: NextLink,
        href,
        target,
        rel,
        prefetch,
        scroll: true,
      }
    : {};

  return (
    <Button
      {...linkProps}
      {...rest}
      sx={{
        backgroundImage: "linear-gradient(135deg, #C9A03F 0%, #D4B05E 100%)",
        color: "#0A0A0A",
        fontWeight: 600,
        borderRadius: 12,
        px: 3,
        py: 1,
        boxShadow: "0 12px 30px rgba(201,160,63,0.22)",
        "&:hover": {
          backgroundImage: "linear-gradient(135deg, #D4B05E 0%, #C9A03F 100%)",
          boxShadow: "0 20px 45px rgba(201,160,63,0.3)",
        },
        ...sx,
      }}
    />
  );
}

