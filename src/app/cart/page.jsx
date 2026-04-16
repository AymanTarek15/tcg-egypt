"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/app/components/layout/Container/Container";
import styles from "./CartPage.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const MINIMUM_ORDER = 250;

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
    payment_method: "cash_on_delivery",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);

  const isAuthError = (data, res) => {
    if (res.status === 401) return true;

    const msg =
      data?.detail ||
      data?.error ||
      "";

    return (
      msg.toLowerCase().includes("given token not valid") ||
      msg.toLowerCase().includes("token not valid") ||
      msg.toLowerCase().includes("authentication credentials were not provided") ||
      msg.toLowerCase().includes("not authenticated")
    );
  };

  const clearBadAuth = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");
      setAuthRequired(false);

      const token = localStorage.getItem("access");

      if (!token) {
        setAuthRequired(true);
        return;
      }

      const res = await fetch(`${API_BASE}/api/cart/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (isAuthError(data, res)) {
          clearBadAuth();
          setAuthRequired(true);
          return;
        }

        throw new Error(data.detail || data.error || "Failed to fetch cart");
      }

      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/cities/`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setCities(data);
      } else if (data.results) {
        setCities(data.results);
      }
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchCities();
  }, []);

  const groupedCart = useMemo(() => {
    if (!cart?.items) return {};

    return cart.items.reduce((acc, item) => {
      const sellerKey = item.seller_id;

      if (!acc[sellerKey]) {
        acc[sellerKey] = {
          seller_username: item.seller_username,
          items: [],
        };
      }

      acc[sellerKey].items.push(item);
      return acc;
    }, {});
  }, [cart]);

  const selectedCity = useMemo(() => {
    return cities.find((city) => city.name === form.city);
  }, [cities, form.city]);

  const shippingPrice = selectedCity ? Number(selectedCity.shipping_price) : 0;

  const sellerGroups = useMemo(() => {
    return Object.entries(groupedCart).map(([sellerId, group]) => {
      const subtotal = group.items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );

      const valid = subtotal >= MINIMUM_ORDER;
      const total = subtotal + shippingPrice;

      return {
        sellerId,
        seller_username: group.seller_username,
        items: group.items,
        subtotal,
        shipping: shippingPrice,
        total,
        valid,
        missing: valid ? 0 : MINIMUM_ORDER - subtotal,
      };
    });
  }, [groupedCart, shippingPrice]);

  const grandSubtotal = sellerGroups.reduce((sum, group) => sum + group.subtotal, 0);
  const grandShipping = sellerGroups.reduce((sum, group) => sum + group.shipping, 0);
  const grandTotal = grandSubtotal + grandShipping;
  const allValid = sellerGroups.every((group) => group.valid);

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem("access");

      if (!token) {
        setAuthRequired(true);
        return;
      }

      const res = await fetch(`${API_BASE}/api/cart/item/${itemId}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (isAuthError(data, res)) {
          clearBadAuth();
          setAuthRequired(true);
          return;
        }

        throw new Error(data.error || "Failed to update item");
      }

      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem("access");

      if (!token) {
        setAuthRequired(true);
        return;
      }

      const res = await fetch(`${API_BASE}/api/cart/item/${itemId}/remove/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (isAuthError(data, res)) {
          clearBadAuth();
          setAuthRequired(true);
          return;
        }

        throw new Error(data.error || "Failed to remove item");
      }

      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      setCheckoutMessage("");
      setError("");

      const token = localStorage.getItem("access");

      if (!token) {
        setAuthRequired(true);
        return;
      }

      const res = await fetch(`${API_BASE}/api/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (isAuthError(data, res)) {
          clearBadAuth();
          setAuthRequired(true);
          return;
        }

        throw new Error(data.error || "Checkout failed");
      }

      setCheckoutMessage("Order placed successfully");
      fetchCart();
    } catch (err) {
      setCheckoutMessage(err.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className={styles.stateBox}>Loading cart...</div>
      </Container>
    );
  }

  if (authRequired) {
    return (
      <Container>
        <div className={styles.loginRequiredBox}>
          <h2 className={styles.loginRequiredTitle}>Login required</h2>
          <p className={styles.loginRequiredText}>
            You need to log in to access your cart and continue to checkout.
          </p>

          <div className={styles.loginRequiredActions}>
            <Link href="/login" className={styles.loginBtn}>
              Go to Login
            </Link>
            <Link href="/cards" className={styles.secondaryBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className={styles.stateBoxError}>{error}</div>
      </Container>
    );
  }
  
  console.log(groupedCart);
  

  return (
    <Container>
      <section className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Your Cart</h1>
          <p className={styles.subtitle}>
            Review your items, grouped by seller, before checkout.
          </p>
        </div>

        {!cart?.items?.length ? (
          <div className={styles.emptyBox}>
            <h2>Your cart is empty</h2>
            <p>Add some cards first to continue.</p>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.left}>
              {sellerGroups.map((group) => (
                <div key={group.sellerId} className={styles.sellerCard}>
                  <div className={styles.sellerHeader}>
                    <div>
                      <h2 className={styles.sellerTitle}>
                        Seller: {group.seller_username}
                      </h2>
                      <p className={styles.sellerMeta}>
                        {group.items.length} item{group.items.length > 1 ? "s" : ""}
                      </p>
                    </div>

                    {group.valid ? (
                      <span className={styles.validBadge}>Eligible</span>
                    ) : (
                      <span className={styles.warningBadge}>Below minimum</span>
                    )}
                  </div>

                  {!group.valid && (
                    <div className={styles.warningBox}>
                      Add <strong>{group.missing} EGP</strong> more to reach the minimum
                      order of <strong>{MINIMUM_ORDER} EGP</strong> for this seller.
                    </div>
                  )}

                  <div className={styles.itemsList}>
                    {group.items.map((item) => (
                      <article key={item.id} className={styles.cartItem}>
                        <div className={styles.imageWrap}>
                          <img src={item.image} alt={item.name} className={styles.image} />
                        </div>

                        <div className={styles.itemInfo}>
                          <h3 className={styles.itemName}>{item.name}</h3>
                          <p className={styles.itemPrice}>{item.price} EGP</p>
                        </div>

                        <div className={styles.itemActions}>
                          <div className={styles.qtyBox}>
                            <button
                              className={styles.qtyBtn}
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <span className={styles.qtyValue}>{item.quantity}</span>
                            <button
                              className={styles.qtyBtn}
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>

                          <button
                            className={styles.removeBtn}
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className={styles.sellerTotals}>
                    <div className={styles.totalRow}>
                      <span>Subtotal</span>
                      <span>{group.subtotal} EGP</span>
                    </div>
                    <div className={styles.totalRow}>
                      <span>Shipping</span>
                      <span>{group.shipping} EGP</span>
                    </div>
                    <div className={`${styles.totalRow} ${styles.totalFinal}`}>
                      <span>Total</span>
                      <span>{group.total} EGP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className={styles.right}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Checkout Summary</h2>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Phone</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>City</label>
                    <select
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    >
                      <option value="">Select city</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label>Address</label>
                    <textarea
                      rows="3"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Payment Method</label>
                    <select
                      value={form.payment_method}
                      onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    >
                      <option value="cash_on_delivery">Cash on Delivery</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="card">Card</option>
                    </select>
                  </div>

                  <div className={`${styles.field} ${styles.fullWidth}`}>
                    <label>Notes</label>
                    <textarea
                      rows="3"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.summaryTotals}>
                  <div className={styles.totalRow}>
                    <span>Subtotal</span>
                    <span>{grandSubtotal} EGP</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span>Total Shipping</span>
                    <span>{grandShipping} EGP</span>
                  </div>
                  <div className={`${styles.totalRow} ${styles.totalFinal}`}>
                    <span>Grand Total</span>
                    <span>{grandTotal} EGP</span>
                  </div>
                </div>

                {!allValid && (
                  <div className={styles.checkoutWarning}>
                    Some seller groups are still below the minimum order amount.
                  </div>
                )}

                <button
                  className={styles.checkoutBtn}
                  disabled={!allValid || checkoutLoading}
                  onClick={handleCheckout}
                >
                  {checkoutLoading ? "Processing..." : "Place Order"}
                </button>

                {checkoutMessage && (
                  <p className={styles.checkoutMessage}>{checkoutMessage}</p>
                )}
              </div>
            </aside>
          </div>
        )}
      </section>
    </Container>
  );
}