export const metadata = {
  title: "About Us",
  description: "Learn more about TCG Egypt and our mission.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <section className="legal-page">
      <div className="legal-container">
        <h1>About Us</h1>
        <p className="last-updated">Last updated: April 10, 2026</p>

        <p>
          TCG Egypt is an online marketplace dedicated to trading card game
          enthusiasts in Egypt.
        </p>

        <p>Our platform allows users to:</p>
        <ul>
          <li>Buy and sell Yu-Gi-Oh! cards</li>
          <li>Discover new cards and collections</li>
          <li>Stay updated with meta trends and tier lists</li>
        </ul>

        <h2>Our Mission</h2>
        <p>
          Our mission is to create a safe, trusted, and easy-to-use platform
          for the Egyptian Yu-Gi-Oh! community.
        </p>

        <h2>How It Works</h2>
        <p>
          TCG Egypt connects buyers and sellers directly. Sellers list their
          cards, and buyers can browse and purchase them through the platform.
        </p>

        <p>TCG Egypt does not own or sell the items listed by users.</p>

        <h2>Disclaimer</h2>
        <p>
          Yu-Gi-Oh! and all related names, card artwork, and content are the
          property of Konami. TCG Egypt is not affiliated with or endorsed by
          Konami.
        </p>
      </div>
    </section>
  );
}