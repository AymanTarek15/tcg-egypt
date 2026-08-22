"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../Container/Container";
import styles from "./Navbar.module.css";
import { isLoggedIn, logoutUser } from "@/lib/auth";


const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);

  const router = useRouter();

  function closeMenu() {
    setOpen(false);
  }

  async function loadWallet() {
    const token = localStorage.getItem("access");

    if (!token) {
      setWallet(null);
      return;
    }

    try {
      setWalletLoading(true);

      const res = await fetch(`${API_BASE}/api/points/wallet/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status === 401) {
          setWallet(null);
          return;
        }
        throw new Error("Failed to fetch wallet");
      }

      const data = await res.json();
      setWallet(data);
    } catch (error) {
      console.error("Wallet fetch error:", error.message);
      setWallet(null);
    } finally {
      setWalletLoading(false);
    }
  }

  useEffect(() => {
    function checkAuth() {
      const auth = isLoggedIn();
      setLoggedIn(auth);

      if (auth) {
        loadWallet();
      } else {
        setWallet(null);
      }
    }

    checkAuth();

    window.addEventListener("authChanged", checkAuth);
    window.addEventListener("walletUpdated", loadWallet);

    const interval = setInterval(checkAuth, 30000);

    return () => {
      window.removeEventListener("authChanged", checkAuth);
      window.removeEventListener("walletUpdated", loadWallet);
      clearInterval(interval);
    };
  }, []);

  function handleLogout() {
    logoutUser();
    setLoggedIn(false);
    setWallet(null);
    closeMenu();
    window.dispatchEvent(new Event("authChanged"));
    router.push("/login");
  }

  return (
    <header className={styles.navbar}>
      <Container>
        <div className={styles.wrapper}>
          {/* <Link href="/" className={styles.logo} onClick={closeMenu}>
            TCG Egypt
          </Link> */}

          <Link href="/" className={styles.logo} onClick={closeMenu} aria-label="TCG Egypt home">
            <svg
              className={styles.logoMark}
              viewBox="0 0 56 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <g transform="rotate(-20 28 44)">
                <rect x="17" y="10" width="22" height="32" rx="4" fill="#2b3442" stroke="#3c465a" strokeWidth="1.2" />
              </g>
              <g transform="rotate(20 28 44)">
                <rect x="17" y="10" width="22" height="32" rx="4" fill="#586274" stroke="#6b7791" strokeWidth="1.2" />
              </g>
              <rect x="17" y="8" width="22" height="32" rx="4" fill="#ff3b3b" />
              <rect x="20" y="12" width="16" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.4" />
              <circle cx="28" cy="27" r="4" fill="#ffffff" fillOpacity="0.85" />
            </svg>
            <span className={styles.wordmark}>
              <span className={styles.word}>
                TC<span className={styles.g}>G</span>
              </span>
              <span className={styles.wordSub}>EGYPT</span>
            </span>
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
            <Link href="/listings" onClick={closeMenu}>Listings</Link>
            <Link href="/cards" onClick={closeMenu}>Cards</Link>
            <Link href="/profile" onClick={closeMenu}>Profile</Link>
            <Link href="/cart" onClick={closeMenu}>Cart</Link>
            <Link href="/sell" onClick={closeMenu} className={styles.sellCta}>
              + Sell a card
            </Link>

            {loggedIn && (
              <Link href="#" onClick={closeMenu} className={styles.pointsWrap}>
                {walletLoading ? (
                  <span className={styles.pointsLoading}>Loading...</span>
                ) : (
                  <>
                    <span className={styles.freeBadge}>
                      Free {wallet?.free_points_balance ?? 0}
                    </span>
                    <span className={styles.paidBadge}>
                      Paid {wallet?.paid_points_balance ?? 0}
                    </span>
                  </>
                )}
              </Link>
            )}

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