export const metadata = {
  title: "Content & Copyright Policy",
  description: "Read the TCG Egypt Content and Copyright Policy.",
  alternates: {
    canonical: "/content-policy",
  },
};

export default function ContentPolicyPage() {
  return (
    <section className="legal-page">
      <div className="legal-container">
        <h1>Content &amp; Copyright Policy</h1>
        <p className="last-updated">Last updated: April 10, 2026</p>

        <h2>1. Intellectual Property</h2>
        <p>
          All Yu-Gi-Oh! cards, names, artwork, images, logos, and related
          content are the property of Konami and their respective owners.
        </p>

        <p>
          TCG Egypt does not claim ownership of any official Yu-Gi-Oh! card
          names, images, or related intellectual property.
        </p>

        <h2>2. User Content</h2>
        <p>
          Users may upload their own listing photos and other content. By
          uploading content to TCG Egypt, the user confirms that:
        </p>
        <ul>
          <li>They own the content, or</li>
          <li>They have the legal right or permission to use and upload it</li>
        </ul>

        <h2>3. Prohibited Content</h2>
        <p>Users must not upload content that:</p>
        <ul>
          <li>Infringes copyright, trademark, or other intellectual property</li>
          <li>Is false, misleading, or fraudulent</li>
          <li>Violates any applicable law or regulation</li>
        </ul>

        <h2>4. Copyright Complaints</h2>
        <p>
          If you believe that content on TCG Egypt infringes your rights, please
          contact us at:
        </p>
        <p>
          <a href="mailto:support@tcg-egypt.com">support@tcg-egypt.com</a>
        </p>

        <p>
          Please include enough detail for us to identify the content and review
          your complaint.
        </p>

        <h2>5. Platform Role</h2>
        <p>
          TCG Egypt acts only as a platform for user listings and is not
          responsible for content uploaded by users. However, we reserve the
          right to remove content that violates this policy.
        </p>
      </div>
    </section>
  );
}