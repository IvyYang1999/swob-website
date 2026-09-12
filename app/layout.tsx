import type { Metadata } from "next";
import Script from "next/script";
import { Onest, Geist_Mono } from "next/font/google";
import "./swob.css";

const onest = Onest({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-onest", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://swob.app"),
  title: "Swob — your AI history, kept",
  description: "Swob reads the sessions Claude Code, Codex, Cursor and other agents leave on your Mac and turns them into a local library you own: a diary of each day, a finder for any moment, a share for what is worth showing, and an audit of how you really work with AI.",
  openGraph: { siteName: "Swob", type: "website", url: "https://swob.app", images: ["/icons/swob-512.png"] },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${onest.variable} ${geistMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'SoftwareApplication',name:'Swob',url:'https://swob.app/',operatingSystem:'macOS',applicationCategory:'ProductivityApplication'})}} />
        <script defer data-domain="swob.app" src="https://plausible.io/js/script.js" />
      </head>
      <body>{children}<Script src="/dc-analytics.js" strategy="afterInteractive" data-ga-id="G-JFFHLKQTKX" data-site="swob" data-hosts="swob.app,www.swob.app" /></body>
    </html>
  );
}
