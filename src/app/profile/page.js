"use client";

import { useEffect, useState } from "react";
import Container from "@/app/components/layout/Container/Container";
import styles from "./ProfilePage.module.css";
import { getAccessToken, logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { countryCodes } from "@/data/countryCodes";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    country_code: "+20",
    phone_number: "",
    shipping_address: "",
  });

  useEffect(() => {
    async function loadProfilePage() {
      const token = getAccessToken();

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        // ✅ Step 1: get profile FIRST
        const profileRes = await fetch(`${API_BASE}/api/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (profileRes.status === 401) {
          logoutUser();
          window.dispatchEvent(new Event("authChanged"));
          router.push("/login");
          return;
        }

        const profileData = await profileRes.json();

        // ✅ Step 2: fetch listings using USER ID
        const listingsRes = await fetch(
          `${API_BASE}/api/cards/listings/?seller=${profileData.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const listingsData = await listingsRes.json();

        setProfile(profileData);

        setFormData({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          phone_number: profileData.phone_number || "",
          shipping_address: profileData.shipping_address || "",
          country_code: "+20",
        });

        setListings(
          Array.isArray(listingsData)
            ? listingsData
            : listingsData.results || [],
        );
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    }

    loadProfilePage();
  }, [router]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();

    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const res = await fetch(`${API_BASE}/api/users/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 401) {
        logoutUser();
        window.dispatchEvent(new Event("authChanged"));
        router.push("/login");
        return;
      }

      if (!res.ok) {
        setError(
          data?.detail ||
            data?.message ||
            JSON.stringify(data) ||
            "Failed to update profile.",
        );
        return;
      }

      setProfile(data);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className={styles.page}>
        <Container>
          <p className={styles.stateText}>Loading profile...</p>
        </Container>
      </section>
    );
  }

  async function handleDelete(slug) {
  const confirmed = window.confirm("Are you sure you want to delete this listing?");
  if (!confirmed) return;

  try {
    const token = getAccessToken();

    const res = await fetch(`${API_BASE}/api/cards/listings/${slug}/`, {
      method: "PATCH", // 👈 soft delete
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active: false }),
    });

    if (!res.ok) {
      throw new Error("Failed to delete listing.");
    }

    // remove from UI instantly
    setListings((prev) => prev.filter((l) => l.slug !== slug));
  } catch (err) {
    alert("Failed to delete listing.");
  }
}

  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.layout}>
          <div className={styles.profileCard}>
            <h1 className={styles.title}>My Profile</h1>

            {profile && (
              <div className={styles.accountMeta}>
                <p>
                  <strong>Username:</strong> {profile.username}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
              </div>
            )}

            <form className={styles.form} onSubmit={handleSave}>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.field}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.field}>
                  <label>Phone Number</label>

                  <div className={styles.phoneRow}>
                    <select
                      name="country_code"
                      value={formData.country_code}
                      onChange={handleChange}
                      className={styles.countryCode}
                    >
                      {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code} ({country.name})
                        </option>
                      ))}
                    </select>

                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="10xxxxxxxx"
                      className={styles.phoneInput}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Shipping Address</label>
                  <textarea
                    name="shipping_address"
                    rows="4"
                    value={formData.shipping_address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && <p className={styles.errorText}>{error}</p>}
              {success && <p className={styles.successText}>{success}</p>}

              <button
                type="submit"
                className={styles.saveBtn}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          <div className={styles.listingsCard}>
            <div className={styles.listingsHeader}>
              <h2>My Listings</h2>
              <span>{listings.length}</span>
            </div>

            {listings.length === 0 ? (
              <p className={styles.stateText}>
                You have not listed any cards yet.
              </p>
            ) : (
              <div className={styles.listingsGrid}>
                {listings.map((listing) => (
                  <div key={listing.id} className={styles.listingItem}>
                    <img
                      src={listing.image_url}
                      alt={listing.name}
                      className={styles.listingImage}
                    />

                    <div className={styles.listingBody}>
                      <h3>{listing.name}</h3>

                      <div className={styles.listingTopRow}>
                        <div className={styles.priceTag}>
                          {listing.price} EGP
                        </div>

                        <span
                          className={
                            listing.is_sold
                              ? styles.soldBadge
                              : styles.availableBadge
                          }
                        >
                          {listing.is_sold ? "Sold" : "Available"}
                        </span>
                      </div>

                      <small>{listing.condition}</small>

                      {/* 🔥 ACTIONS */}
                      <div className={styles.listingActions}>
                        <button
                          className={styles.editBtn}
                          onClick={() =>
                            router.push(
                              `/edit/${listing.slug}`,
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(listing.slug)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
