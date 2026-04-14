"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/app/components/layout/Container/Container";
import styles from "../login/AuthPage.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResetPasswordClient({ uid, token }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    confirm_password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!uid || !token) {
      setError("Invalid reset link.");
      return;
    }

    if (!formData.password || !formData.confirm_password) {
      setError("Please fill in both password fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/users/reset-password-confirm/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          token,
          password: formData.password,
          confirm_password: formData.confirm_password,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.detail || data?.message || "Failed to reset password.");
        return;
      }

      setMessage(data?.message || "Password reset successfully.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
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
          <h1>Reset Password</h1>
          <p>Choose a new password for your account.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="password"
              name="password"
              placeholder="New password"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm new password"
              value={formData.confirm_password}
              onChange={handleChange}
            />

            {error && <p className={styles.errorText}>{error}</p>}
            {message && <p className={styles.successText}>{message}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}