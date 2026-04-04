"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@/app/components/layout/Container/Container";
import styles from "./VerifyEmailPage.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    async function verifyEmail() {
      try {
        const res = await fetch(
          `${API_BASE}/api/users/verify-email/?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`
        );

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setStatus("error");
          setMessage(
            data?.message ||
              data?.detail ||
              "Verification failed. The link may be invalid or expired."
          );
          return;
        }

        setStatus("success");
        setMessage(
          data?.message ||
            data?.detail ||
            "Your email has been verified successfully."
        );
      } catch {
        setStatus("error");
        setMessage("Verification failed.");
      }
    }

    if (uid && token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("Invalid verification link.");
    }
  }, [searchParams]);

  // 🔥 Auto redirect logic
  useEffect(() => {
    if (status !== "success") return;

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [status, router]);

  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.card}>
          <h1 className={styles.title}>Email Verification</h1>

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

          {status === "loading" && <div className={styles.spinner} />}

          {status === "success" && (
            <p className={styles.redirectText}>
              Redirecting to login in {countdown}...
            </p>
          )}

          {status !== "loading" && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => router.push("/login")}
            >
              Go to Login
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}