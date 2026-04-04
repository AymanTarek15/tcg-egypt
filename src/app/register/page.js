"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/app/components/layout/Container/Container";
import { registerUser } from "@/lib/auth";
import styles from "../login/AuthPage.module.css";
import Link from "next/link";


export default function RegisterPage() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
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

    if (!formData.username || !formData.email || !formData.password || !formData.password2) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.password2,
      });

      router.push("/login");
    } catch (err) {
  if (err.responseData) {
    setFieldErrors(err.responseData);
  } else {
    setError(err.message);
  }
} finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.card}>
          <h1>Register</h1>
          <p>Create your account to start buying and selling cards.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
            className={fieldErrors.email ? styles.inputError : ""}
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            {fieldErrors.username && (
  <p className={styles.errorText}>{fieldErrors.username[0]}</p>
)}

            <input
            className={fieldErrors.email ? styles.inputError : ""}
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            {fieldErrors.email && (
  <p className={styles.errorText}>{fieldErrors.email[0]}</p>
)}

            <input
            className={fieldErrors.email ? styles.inputError : ""}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            {fieldErrors.password && (
  <p className={styles.errorText}>{fieldErrors.password[0]}</p>
)}

            <input
            className={fieldErrors.email ? styles.inputError : ""}
              type="password"
              name="password2"
              placeholder="Confirm password"
              value={formData.password2}
              onChange={handleChange}
            />

            {fieldErrors.confirm_password && (
  <p className={styles.errorText}>{fieldErrors.confirm_password[0]}</p>
)}

            {error && <p className={styles.errorText}>{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>
          <p className={styles.switchAuth}>
  Already have an account?{" "}
  <Link href="/login" className={styles.link}>
    Login here
  </Link>
</p>
        </div>
      </Container>
    </section>
  );
}