export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/checkout/", "/profile", "/login", "/edit/"],
    },
    sitemap: "https://tcg-egypt.com/sitemap.xml",
    host: "https://tcg-egypt.com",
  };
}
