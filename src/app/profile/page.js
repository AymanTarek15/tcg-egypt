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
  const [wallet, setWallet] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [packages, setPackages] = useState([]);
  const [buyingPackageId, setBuyingPackageId] = useState(null);

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

      const packagesRes = await fetch(`${API_BASE}/api/points/packages/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      let packagesData = [];
      if (packagesRes.ok) {
        packagesData = await packagesRes.json();
      }

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

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

        const walletRes = await fetch(`${API_BASE}/api/points/wallet/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        let walletData = null;
        if (walletRes.ok) {
          walletData = await walletRes.json();
        }

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
        setWallet(walletData);
        setPackages(
          Array.isArray(packagesData)
            ? packagesData
            : packagesData.results || []
        );

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

    function refreshWallet() {
      loadProfilePage();
    }

    window.addEventListener("walletUpdated", refreshWallet);

    return () => {
      window.removeEventListener("walletUpdated", refreshWallet);
    };
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

  async function handleDelete(slug) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmed) return;

    try {
      const token = getAccessToken();

      const res = await fetch(`${API_BASE}/api/cards/listings/${slug}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: false }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete listing.");
      }

      setListings((prev) => prev.filter((l) => l.slug !== slug));
    } catch (err) {
      alert("Failed to delete listing.");
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

  // ✅ FIX ADDED HERE ONLY
  const bestPackageId = (() => {
    
    if (!packages.length) return null;

    let best = packages[0];
    let bestValue = best.points / best.price;

    for (let i = 1; i < packages.length; i++) {
      const current = packages[i];
      const currentValue = current.points / current.price;

      if (currentValue > bestValue) {
        best = current;
        bestValue = currentValue;
      }
    }

    return best.id;
  })();

  const cheapestPackage = packages.length ? packages[0] : null;

const basePricePerPoint = cheapestPackage
  ? cheapestPackage.price / cheapestPackage.points
  : 0;

  async function handleBuyPoints(packageId) {
  const token = getAccessToken();

  if (!token) {
    router.push("/login");
    return;
  }

  try {
    setBuyingPackageId(packageId);
    setError("");

    console.log("Starting point purchase for package:", packageId);

    const res = await fetch(`${API_BASE}/api/points/purchase/start/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ package_id: packageId }),
    });

    const data = await res.json().catch(() => null);

    console.log("Purchase start status:", res.status);
    console.log("Purchase start response:", data);

    if (res.status === 401) {
      logoutUser();
      window.dispatchEvent(new Event("authChanged"));
      router.push("/login");
      return;
    }

    if (!res.ok) {
      setError(data?.detail || data?.message || "Failed to start point purchase.");
      return;
    }

    if (data?.checkout_url) {
      window.location.href = data.checkout_url;
      return;
    }

    setError("No checkout URL was returned.");
  } catch (err) {
    console.error("handleBuyPoints error:", err);
    setError("Something went wrong while starting the purchase.");
  } finally {
    setBuyingPackageId(null);
  }
}

  return (
    // 👇 (rest of your file unchanged)
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

            <div className={styles.balanceCard}>
              <div className={styles.balanceHeader}>
                <h2>My Points</h2>
                <span className={styles.totalBadge}>
                  Total {wallet?.total_points ?? 0}
                </span>
              </div>

              <div className={styles.balanceGrid}>
                <div className={styles.balanceItem}>
                  <span className={styles.balanceLabel}>Free Points</span>
                  <strong className={styles.freeValue}>
                    {wallet?.free_points_balance ?? 0}
                  </strong>
                </div>

                <div className={styles.balanceItem}>
                  <span className={styles.balanceLabel}>Paid Points</span>
                  <strong className={styles.paidValue}>
                    {wallet?.paid_points_balance ?? 0}
                  </strong>
                </div>

                {/* <div className={styles.balanceItem}>
                  <span className={styles.balanceLabel}>Monthly Free Quota</span>
                  <strong>{wallet?.free_points_monthly_quota ?? 0}</strong>
                </div> */}

                {/* <div className={styles.balanceItem}>
                  <span className={styles.balanceLabel}>Last Reset</span>
                  <strong>
                    {wallet?.free_points_last_reset_at
                      ? new Date(wallet.free_points_last_reset_at).toLocaleDateString()
                      : "—"}
                  </strong>
                </div> */}
              </div>
            </div>

            <div className={styles.packagesCard}>
  <div className={styles.packagesHeader}>
    <h2>Buy Points</h2>
    <p className={styles.packagesText}>
      Buy paid points to boost listings and unlock seller features.
    </p>
    <p className={styles.packagesText}>
      We also accept instapay, vodafone cash and cash payments, Contact us first through Email or whatsapp.
    </p>
  </div>

  {packages.length === 0 ? (
    <p className={styles.stateText}>No point packages available right now.</p>
  ) : (
    <div className={styles.packagesGrid}>
  {packages.map((pkg) => {
  const isBest = pkg.id === bestPackageId;
  const packagePricePerPoint = pkg.price / pkg.points;
  const savePercent =
  basePricePerPoint > 0
    ? Math.max(
        0,
        Math.round(
          ((basePricePerPoint - packagePricePerPoint) / basePricePerPoint) * 100
        )
      )
    : 0;

  return (
    <div
      key={pkg.id}
      className={`${styles.packageItem} ${
        isBest ? styles.featuredPackage : ""
      }`}
    >
      {isBest && <div className={styles.bestBadge}>Best Value</div>}

      {savePercent > 0 && (
  <div className={styles.saveBadge}>Save {savePercent}%</div>
)}

      <h3 className={styles.packageTitle}>{pkg.name}</h3>

      <div className={styles.packagePoints}>
        {pkg.points}
        <span> Points</span>
      </div>

      <div className={styles.packagePrice}>{pkg.price} EGP</div>

      <div className={styles.valueText}>
        {(pkg.points / pkg.price).toFixed(2)} pts / EGP
      </div>

      {/* <button
  type="button"
  className={`${styles.buyBtn} ${
    isBest ? styles.buyBtnFeatured : ""
  }`}
  onClick={() => handleBuyPoints(pkg.id)}
  disabled={buyingPackageId === pkg.id}
>
  {buyingPackageId === pkg.id ? "Processing..." : "Buy Now"}
</button> */}
    </div>
  );
})}
</div>
  )}
</div>

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

                      <div className={styles.listingActions}>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => router.push(`/edit/${listing.slug}`)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
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