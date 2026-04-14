// import EditListingClient from "./EditListingClient";
import { fetchAPI } from "@/lib/api";
import EditListingClient from "./EditListingClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EditListingPage({ params }) {
  const { slug } = await params;

  let listing = null;

  try {
    const data = await fetchAPI(`/api/cards/listings/?slug=${encodeURIComponent(slug)}`);
    listing = data?.results?.[0] || null;
  } catch (error) {
    console.error("Edit listing fetch error:", error.message);
  }

  if (!listing) {
    return <div style={{ padding: "40px" }}>Listing not found.</div>;
  }

  return <EditListingClient listing={listing} />;
}