import Footer from "./components/layout/Footer/Footer";
import Navbar from "./components/layout/Navbar/Navbar";
import "./globals.css";
// import Footer from "@/components/layout/Footer/Footer";

export const metadata = {
  title: "YGO Egypt",
  description: "Yu-Gi-Oh marketplace, meta updates, and tier lists for Egypt",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}