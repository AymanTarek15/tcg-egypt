import Footer from "./components/layout/Footer/Footer";
import Navbar from "./components/layout/Navbar/Navbar";
import "./globals.css";

/** @type {import("next").Metadata} */
export const metadata = {
  metadataBase: new URL("https://tcg-egypt.com"),
  title: {
    default: "TCG Egypt",
    template: "%s | TCG Egypt",
  },
  icons:{
    icon:"/favicon.ico"
  },
  description: "Yu-Gi-Oh marketplace, meta updates, and tier lists for Egypt.",
  keywords: [
    "Yu-Gi-Oh Egypt",
    "YGO Egypt",
    "Yu-Gi-Oh cards Egypt",
    "TCG Egypt",
    "Yu-Gi-Oh marketplace",
    "tier lists",
    "meta updates",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://tcg-egypt.com",
    siteName: "TCG Egypt",
    title: "TCG Egypt",
    description: "Yu-Gi-Oh marketplace, meta updates, and tier lists for Egypt.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TCG Egypt",
    description: "Yu-Gi-Oh marketplace, meta updates, and tier lists for Egypt.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3480466222841830"
     crossorigin="anonymous"></script>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
      </head>
    </html>
  );
}