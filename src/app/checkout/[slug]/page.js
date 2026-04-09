import { fetchAPI } from "@/lib/api";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CheckoutPage({ params }) {
  const { slug } = await params;

  let listing = null;

  try {
    const data = await fetchAPI(`/api/cards/listings/?slug=${encodeURIComponent(slug)}`);
    listing = data?.results?.[0] || null;

    // console.log("this slug is:", slug);
    // console.log("fetched listing:", listing);
  } catch (error) {
    console.error("Checkout listing fetch error:", error.message);
  }

  if (!listing) {
    return <div style={{ padding: "40px" }}>Listing not found.</div>;
  }

  return <CheckoutClient listing={listing} />;
}