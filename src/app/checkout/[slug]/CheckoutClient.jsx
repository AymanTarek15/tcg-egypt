"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/app/components/layout/Container/Container";
import { getAccessToken, logoutUser } from "@/lib/auth";
import styles from "./CheckoutPage.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CheckoutClient({ listing }) {
  const router = useRouter();
const [cities, setCities] = useState([]);
const [loadingCities, setLoadingCities] = useState(true);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    shipping_address: "",
    city: "",
    notes: "",
    payment_method: "cash_on_delivery",
  });

  const selectedCity = cities.find(
  (city) => String(city.id) === String(formData.city)
);

const shippingFee = Number(selectedCity?.shipping_price || 0);
const subtotal = Number(listing.price || 0);
const total = subtotal + shippingFee;

  useEffect(() => {
    async function loadProfile() {
      const token = getAccessToken();

      if (!token) {
        setLoadingProfile(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/users/me/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          logoutUser();
          window.dispatchEvent(new Event("authChanged"));
          setLoadingProfile(false);
          return;
        }

        const data = await res.json();

        setFormData((prev) => ({
          ...prev,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          shipping_address: data.shipping_address || "",
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, []);

  useEffect(() => {
  async function loadCities() {
    try {
      const res = await fetch(`${API_BASE}/api/orders/cities/`);

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }

      const data = await res.json();
      setCities(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("[browser] Failed to load cities", err);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }

  loadCities();
}, []);




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
    setSuccess("");

    if (!formData.first_name || !formData.last_name) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.phone_number) {
      setError("Please enter your phone number.");
      return;
    }

    if (!formData.shipping_address) {
      setError("Please enter your shipping address.");
      return;
    }

    if (!formData.city) {
      setError("Please enter your city.");
      return;
    }

    try {
      setSubmitting(true);

      const token = getAccessToken();

      const payload = {
  listing: listing.id,
  quantity: 1,
  full_name: `${formData.first_name} ${formData.last_name}`.trim(),
  email: formData.email,
  phone: formData.phone_number,
  address: formData.shipping_address,
  city: formData.city,
  notes: formData.notes,
  payment_method: formData.payment_method,
};

      const res = await fetch(`${API_BASE}/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          data?.detail ||
            data?.message ||
            JSON.stringify(data) ||
            "Failed to place order."
        );
        return;
      }

      setSuccess("Order placed successfully.");
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      setError("Something went wrong while placing the order.");
    } finally {
      setSubmitting(false);
    }
  }
console.log(`cities are ${cities}`);
console.log(cities);
  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.layout}>
          <div className={styles.formCard}>
            <h1 className={styles.title}>Checkout</h1>
            <p className={styles.subtitle}>
              Enter your shipping details and choose a payment method.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
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
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    // onChange={handleChange}
                    readOnly
                    className={styles.readOnlyInput}
                  />
                  {/* <small>This email is linked to your account and cannot be changed.</small> */}
                </div>

                <div className={styles.field}>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.fieldFull}>
                  <label>Shipping Address</label>
                  <textarea
                    name="shipping_address"
                    rows="4"
                    value={formData.shipping_address}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.field}>
                  <label>City</label>
                  <select
    name="city"
    value={formData.city}
    onChange={handleChange}
    disabled={loadingCities}
  >
    <option value="">
      {loadingCities ? "Loading cities..." : "Select city"}
    </option>

    {cities.map((city) => (
      <option key={city.id} value={city.id}>
        {city.name} — {city.shipping_price} EGP
      </option>
    ))}
  </select>
                </div>

                <div className={styles.field}>
                  <label>Payment Method</label>
                  <select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                  >
                    <option value="cash_on_delivery">Cash on Delivery</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className={styles.fieldFull}>
                  <label>Order Notes</label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Optional notes for seller"
                  />
                </div>
              </div>

              {error && <p className={styles.errorText}>{error}</p>}
              {success && <p className={styles.successText}>{success}</p>}

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? "Placing Order..." : "Confirm Order"}
              </button>
            </form>
          </div>

          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.productRow}>
              <img
                src={listing.image_url}
                alt={listing.name}
                className={styles.productImage}
              />

              <div className={styles.productInfo}>
                <h3>{listing.name}</h3>
                <p>{listing.condition}</p>
                {listing.rarity && <p>{listing.rarity}</p>}
                <strong>{listing.price} EGP</strong>
              </div>
            </div>

            <div className={styles.summaryMeta}>
  <div>
    <span>Seller</span>
    <strong>{listing.seller_username || listing.seller}</strong>
  </div>

  <div>
    <span>Edition</span>
    <strong>{listing.edition || "—"}</strong>
  </div>

  <div>
    <span>Language</span>
    <strong>{listing.language || "—"}</strong>
  </div>

  <div>
    <span>Subtotal</span>
    <strong>{subtotal} EGP</strong>
  </div>

  <div>
    <span>Shipping</span>
    <strong>{formData.city ? `${shippingFee} EGP` : "Select city"}</strong>
  </div>

  <div className={styles.totalRow}>
    <span>Total</span>
    <strong>{total} EGP</strong>
  </div>
</div>
          </div>
        </div>
      </Container>
    </section>
  );
}