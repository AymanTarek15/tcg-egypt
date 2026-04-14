"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/app/components/layout/Container/Container";
import { loginUser, saveAuthTokens } from "@/lib/auth";
import styles from "./AuthPage.module.css";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [showResendVerification, setShowResendVerification] = useState(false);
  const [showResendModal, setShowResendModal] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setShowResendVerification(false);

    if (!formData.username || !formData.password) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await loginUser(formData);
      saveAuthTokens(data);
      window.dispatchEvent(new Event("authChanged"));
      router.push("/profile");
    } catch (err) {
      const errorMessage = err.message || "Login failed.";
      setError(errorMessage);

      if (
        errorMessage.toLowerCase().includes("verify your email") ||
        errorMessage.toLowerCase().includes("not verified") ||
        errorMessage.toLowerCase().includes("email before logging in")
      ) {
        setShowResendVerification(true);
      } else {
        setShowResendVerification(false);
      }
    } finally {
      // 🔥 THIS FIXES YOUR ISSUE
      setLoading(false);
    }
  }

  async function handleResendSubmit() {
    if (!resendEmail) {
      setResendMessage("Please enter your email.");
      return;
    }

    try {
      setResendLoading(true);
      setResendMessage("");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/resend-verification/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: resendEmail }),
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setResendMessage(
          data?.message ||
            data?.detail ||
            "Failed to resend verification email.",
        );
        return;
      }

      setResendMessage(
        data?.message ||
          data?.detail ||
          "Verification email sent successfully.",
      );
    } catch {
      setResendMessage("Something went wrong.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.card}>
          <h1>Login</h1>
          <p>Access your account to manage listings and purchases.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username or email"
              value={formData.username}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <div className={styles.forgotRow}>
  <Link href="/forgot-password" className={styles.forgotLink}>
    Forgot password?
  </Link>
</div>

            {error && <p className={styles.errorText}>{error}</p>}

            {showResendVerification && (
              <p className={styles.resendText}>
                Didn’t receive verification?{" "}
                <span
                  className={styles.resendLink}
                  onClick={() => {
                    setShowResendModal(true);
                    setResendEmail("");
                    setResendMessage("");
                  }}
                >
                  Resend email
                </span>
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className={styles.switchAuth}>
            Don’t have an account?{" "}
            <Link href="/register" className={styles.link}>
              Register here
            </Link>
          </p>
        </div>
        {showResendModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Resend Verification Email</h3>

              <input
                type="email"
                placeholder="Enter your email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                className={styles.modalInput}
              />

              {resendMessage && (
                <p className={styles.modalMessage}>{resendMessage}</p>
              )}

              <div className={styles.modalActions}>
                <button
                  onClick={handleResendSubmit}
                  disabled={resendLoading}
                  className={styles.modalPrimaryBtn}
                >
                  {resendLoading ? "Sending..." : "Send"}
                </button>

                <button
                  onClick={() => setShowResendModal(false)}
                  className={styles.modalSecondaryBtn}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
