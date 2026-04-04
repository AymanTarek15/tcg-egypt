"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../Container/Container";
import styles from "./Navbar.module.css";
import { isLoggedIn, logoutUser } from "@/lib/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  function closeMenu() {
    setOpen(false);
  }

  useEffect(() => {
    function checkAuth() {
      setLoggedIn(isLoggedIn());
    }

    checkAuth();

    window.addEventListener("authChanged", checkAuth);

    const interval = setInterval(checkAuth, 30000);

    return () => {
      window.removeEventListener("authChanged", checkAuth);
      clearInterval(interval);
    };
  }, []);

  function handleLogout() {
    logoutUser();
    setLoggedIn(false);
    closeMenu();
    window.dispatchEvent(new Event("authChanged"));
    router.push("/login");
  }

  return (
    <header className={styles.navbar}>
      <Container>
        <div className={styles.wrapper}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            TCG Egypt
          </Link>

          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <nav className={`${styles.navlinks} ${open ? styles.active : ""}`}>
            <Link href="/cards" onClick={closeMenu}>Cards</Link>
            <Link href="/sell" onClick={closeMenu}>Sell</Link>
            <Link href="/meta" onClick={closeMenu}>Meta</Link>
            <Link href="/tier-lists" onClick={closeMenu}>Tier Lists</Link>
            <Link href="/news" onClick={closeMenu}>News</Link>
            <Link href="/profile" onClick={closeMenu}>Profile</Link>

            {loggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className={styles.authBtn}
              >
                Logout
              </button>
            ) : (
              <Link href="/login" onClick={closeMenu}>
                Login
              </Link>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}