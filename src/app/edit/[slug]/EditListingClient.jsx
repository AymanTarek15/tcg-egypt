"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import Container from "@/app/components/layout/Container/Container";
import styles from "./EditListing.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function extractErrorMessage(data) {
  if (!data) return "Failed to update listing.";
  if (typeof data === "string") return data;
  if (typeof data.detail === "string") return data.detail;

  const firstKey = Object.keys(data)[0];
  if (!firstKey) return "Failed to update listing.";

  const firstValue = data[firstKey];

  if (Array.isArray(firstValue) && firstValue.length > 0) {
    return firstValue[0];
  }

  if (typeof firstValue === "string") {
    return firstValue;
  }

  return "Failed to update listing.";
}

export default function EditListingClient({ listing }) {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    seller_description: listing.seller_description || "",
    condition: listing.condition || "near_mint",
    edition: listing.edition || "",
    language: listing.language || "English",
    quantity: listing.quantity || 1,
    price: listing.price || "",
    is_active: listing.is_active ?? true,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const token = getAccessToken();

      const res = await fetch(`${API_BASE}/api/cards/listings/${listing.slug}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          seller_description: formData.seller_description,
          condition: formData.condition,
          edition: formData.edition,
          language: formData.language,
          quantity: Number(formData.quantity),
          price: formData.price,
          is_active: formData.is_active,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(extractErrorMessage(data));
        return;
      }

      setSuccess("Listing updated successfully.");

      setTimeout(() => {
        router.push("/profile");
      }, 1200);
    } catch (err) {
      setError("Something went wrong while updating the listing.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.layout}>
          <div className={styles.formCard}>
            <div className={styles.header}>
              <div>
                <p className={styles.eyebrow}>Seller Dashboard</p>
                <h1 className={styles.title}>Edit Listing</h1>
                <p className={styles.subtitle}>
                  Update your listing details, price, availability, and seller note.
                </p>
              </div>

              <button
                type="button"
                className={styles.backBtn}
                onClick={() => router.push("/profile")}
              >
                Back to Profile
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label>Condition</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                  >
                    <option value="mint">Mint</option>
                    <option value="near_mint">Near Mint</option>
                    <option value="light_played">Light Played</option>
                    <option value="moderate_played">Moderate Played</option>
                    <option value="heavy_played">Heavy Played</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Edition</label>
                  <input
                    type="text"
                    name="edition"
                    value={formData.edition}
                    onChange={handleChange}
                    placeholder="1st Edition / Unlimited"
                  />
                </div>

                <div className={styles.field}>
                  <label>Language</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    placeholder="English"
                  />
                </div>

                <div className={styles.field}>
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.fieldFull}>
                  <label>Price (EGP)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                  />
                </div>

                <div className={styles.fieldFull}>
                  <label>Seller Description</label>
                  <textarea
                    name="seller_description"
                    rows="5"
                    value={formData.seller_description}
                    onChange={handleChange}
                    placeholder="Add notes about the card condition, packaging, or anything buyers should know."
                  />
                </div>

                <div className={styles.toggleRow}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                    />
                    Keep this listing active
                  </label>
                </div>
              </div>

              {error && <p className={styles.errorText}>{error}</p>}
              {success && <p className={styles.successText}>{success}</p>}

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => router.push("/profile")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          <aside className={styles.previewCard}>
            <p className={styles.previewLabel}>Listing Preview</p>

            <div className={styles.previewImageWrap}>
              <img
                src={listing.image_url}
                alt={listing.name}
                className={styles.previewImage}
              />
            </div>

            <h2 className={styles.previewTitle}>{listing.name}</h2>

            <div className={styles.previewMeta}>
              <div>
                <span>Set Code</span>
                <strong>{listing.set_code || "—"}</strong>
              </div>

              <div>
                <span>Rarity</span>
                <strong>{listing.rarity || "—"}</strong>
              </div>

              <div>
                <span>Current Price</span>
                <strong>{formData.price || 0} EGP</strong>
              </div>

              <div>
                <span>Quantity</span>
                <strong>{formData.quantity}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{formData.is_active ? "Active" : "Inactive"}</strong>
              </div>
            </div>

            <div className={styles.noteBox}>
              <p className={styles.noteTitle}>Note</p>
              <p className={styles.noteText}>
                Buyers will only see your listing while it is active. Updating the
                price or quantity here will affect the live listing immediately.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}