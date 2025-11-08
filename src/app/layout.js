import "./globals.css";
import Providers from "./providers";
import SiteLayout from "@/components/layout/SiteLayout";
import { Poppins } from "next/font/google";
import ScrollToTop from "@/components/layout/ScrollToTop";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Soto Web Studios Showcase",
  description:
    "Showcase of AI-powered web experience demos built with Next.js, MUI, and OpenAI.",
  metadataBase: new URL("https://www.sotowebstudios.com"),
  icons: {
    icon: [
      { url: "/logos/sws_favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/logos/sws_favicon_svg.svg", type: "image/svg+xml" },
    ],
    shortcut: [{ url: "/logos/sws_favicon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/logos/sws_favicon.png", type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Soto Web Studios Showcase",
    description:
      "Explore AI proof-of-concept demos built with Next.js, MUI, Recharts, and OpenAI.",
    url: "https://www.sotowebstudios.com",
    siteName: "Soto Web Studios",
    images: [
      {
        url: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Soto Web Studios Showcase",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soto Web Studios Showcase",
    description:
      "Explore AI proof-of-concept demos built with Next.js, MUI, Recharts, and OpenAI.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable}>
        <Providers>
          <ScrollToTop />
          <SiteLayout>{children}</SiteLayout>
        </Providers>
      </body>
    </html>
  );
}
