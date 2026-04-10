import Link from "next/link";
import Container from "../Container/Container";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <p>© 2026 TCG Egypt. All rights reserved.</p>
        </div>

        <div className={styles.links}>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/refund-policy">Refund Policy</Link>
          <Link href="/shipping">Shipping Policy</Link>
          {/* <Link href="/cookie-policy">Cookie Policy</Link> */}
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Us</Link>
          <Link href="/content-policy">Content Policy</Link>
        </div>

        <p className={styles.disclaimer}>
          Yu-Gi-Oh! and all related content are property of Konami.
          TCG Egypt is not affiliated with or endorsed by Konami.
        </p>
      </Container>
    </footer>
  );
}