const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchWallet() {
  const token = localStorage.getItem("access");

  if (!token) {
    return null;
  }

  const res = await fetch(`${API_BASE}/api/points/wallet/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401) return null;
    throw new Error("Failed to fetch wallet");
  }

  return res.json();
}