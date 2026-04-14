"use client";

import { useState } from "react";
import Container from "@/app/components/layout/Container/Container";
import styles from "../login/AuthPage.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/users/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.detail || "Failed to send email.");
        return;
      }

      setMessage(data?.message || "Reset link sent.");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.card}>
          <h1>Forgot Password</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p className={styles.errorText}>{error}</p>}
            {message && <p className={styles.successText}>{message}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}