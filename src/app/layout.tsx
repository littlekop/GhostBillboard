import type { Metadata } from "next";
import { Kanit, Sarabun, Chakra_Petch } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-5P3PPCKX9S";

// Each family spans several weights x 2 subsets (10 font files total), so
// preloading all of them blocks the initial render. next/font still emits
// font-display: swap by default, so turning preload off just means text
// paints with the fallback font first and swaps in — no invisible text,
// no layout shift, just no render-blocking <link rel="preload"> chain.
const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["thai", "latin"],
  weight: ["600", "700", "800", "900"],
  preload: false,
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["500", "600"],
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "บิลบอร์ดผี — ชาร์ตเรื่องผีที่คนไทยโหวตเอง",
    template: "%s | บิลบอร์ดผี",
  },
  description:
    "วางลิงก์ YouTube โหวตให้เรื่องหลอนที่สุดขึ้นอันดับ 1 ดูชาร์ต Top 10 เรื่องผีไทยและเล่นคลิปได้ในหน้าเว็บ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${kanit.variable} ${sarabun.variable} ${chakraPetch.variable}`}
    >
      <body className="min-h-screen flex flex-col font-body antialiased">
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
