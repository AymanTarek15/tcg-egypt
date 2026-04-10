export const metadata = {
  title: "Contact Us",
  description: "Contact TCG Egypt for support and inquiries.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <section className="legal-page">
      <div className="legal-container">
        <h1>Contact Us</h1>
        <p className="last-updated">Last updated: April 10, 2026</p>

        <p>
          If you have any questions, concerns, or need support, please contact
          us using the email below.
        </p>

        <h2>Email</h2>
        <p>
          <a href="mailto:support@tcg-egypt.com">support@tcg-egypt.com</a>
        </p>

        <h2>Support Topics</h2>
        <ul>
          <li>Orders and transactions</li>
          <li>Refund requests</li>
          <li>Reporting a seller</li>
          <li>Technical issues</li>
          <li>General inquiries</li>
        </ul>

        <p>We aim to respond within 24 to 48 hours.</p>

        <h2>Important</h2>
        <p>
          TCG Egypt is a marketplace connecting buyers and sellers. For
          order-specific issues, buyers should contact the seller first before
          escalating the matter to us.
        </p>
      </div>
    </section>
  );
}