"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Container from "@/app/components/layout/Container/Container";
import styles from "../login/AuthPage.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();

  const uid = params.get("uid");
  const token = params.get("token");

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

    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/api/users/reset-password-confirm/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid,
            token,
            password: formData.password,
            confirm_password: formData.confirm_password,
          }),
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.detail || "Reset failed.");
        return;
      }

      setMessage("Password reset successful.");

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

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="password"
              name="password"
              placeholder="New password"
              onChange={handleChange}
            />

            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm password"
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