import Container from "../Container/Container";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <p>© 2026 YGO Egypt. All rights reserved.</p>
      </Container>
    </footer>
  );
}