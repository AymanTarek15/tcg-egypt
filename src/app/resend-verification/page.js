"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Container from "@/app/components/layout/Container/Container";
import styles from "./ResendVerificationPage.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResendVerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [loading, setLoading] = useState(false);

  async function resend() {
    if (!email) {
      setStatus("error");
      setMessage("No email address was provided.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setStatus("idle");

      const res = await fetch(`${API_BASE}/api/users/resend-verification/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("error");
        setMessage(
          data?.message ||
            data?.detail ||
            "Failed to resend verification email."
        );
        return;
      }

      setStatus("success");
      setMessage(
        data?.message ||
          data?.detail ||
          "Verification email sent successfully."
      );
    } catch {
      setStatus("error");
      setMessage("Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.card}>
          <h1 className={styles.title}>Resend Verification Email</h1>

          <p className={styles.subtitle}>
            We’ll send a new verification link to:
          </p>

          <p className={styles.email}>{email || "No email provided"}</p>

          {message && (
            <p
              className={`${styles.message} ${
                status === "success"
                  ? styles.success
                  : status === "error"
                  ? styles.error
                  : ""
              }`}
            >
              {message}
            </p>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={resend}
              className={styles.actionBtn}
              disabled={loading || !email}
            >
              {loading ? "Sending..." : "Send Again"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className={styles.secondaryBtn}
            >
              Back to Login
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}