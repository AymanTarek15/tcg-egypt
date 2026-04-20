"use client";

import { useState } from "react";
import styles from "./AddToCartButton.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function AddToCartButton({
  listingId,
  isSold = false,
  className = "",
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (isSold) return;

    try {
      setLoading(true);
      setMessage("");
      setSuccess(false);

      const token = localStorage.getItem("access");

      if (!token) {
        setMessage("You need to log in first");
        return;
      }

      const res = await fetch(`${API_BASE}/api/cart/add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listing_id: listingId,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.detail || "Failed to add to cart");
      }

      setSuccess(true);
      setMessage("Added to cart");
    } catch (error) {
      setMessage(error.message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <div className={`${styles.wrapper} ${className}`}>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading || isSold|| success}
        className={`${styles.button} ${success ? styles.success : ""}`}
      >
        {isSold ? "Sold Out" : loading ? "Adding..." : success ? "Added" : "Add to Cart"}
      </button>

      {message && (
        <p
          className={`${styles.message} ${
            success ? styles.successText : styles.errorText
          }`}
        >
          {message}
        </p>
      )}
    </div>
    
    </div>
  );
}