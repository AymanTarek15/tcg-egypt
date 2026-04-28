import { Suspense } from "react";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Container from "@/app/components/layout/Container/Container";
import SectionTitle from "@/app/shared/sectionTitle/SectionTitle";
import Pagination from "@/app/cards/Pagination";
import { fetchAPI } from "@/lib/api";
import ListingsToolbar from "./ListingsToolbar";
import styles from "./ListingsPage.module.css";
import Link from "next/link";

export default async function ListingsPage({ searchParams }) {
  const params = await searchParams;

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v && v !== "All")
  );

  cleanParams.is_sold = "false";

  const queryString = new URLSearchParams(cleanParams).toString();
  const endpoint = `/api/cards/listings/${queryString ? `?${queryString}` : ""}`;

  let listings = [];
  let count = 0;
  let next = null;
  let previous = null;

  try {
    const data = await fetchAPI(endpoint);

    listings = data.results || (Array.isArray(data) ? data : []);
    count = data.count || listings.length || 0;
    next = data.next || null;
    previous = data.previous || null;
  } catch (error) {
    console.error("Listings fetch error:", error.message);
  }

  const currentPage = Number(params.page || 1);
  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <section className={styles.page}>
      <Container>
        <SectionTitle
          title="Listed Cards"
          subtitle="Search, filter, and browse cards listed by sellers."
        />

        <Suspense fallback={<div>Loading filters...</div>}>
          <ListingsToolbar />
        </Suspense>

        {listings.length > 0 ? (
          <>
            <div className={styles.grid}>
              {listings.map((listing) => (
                <Link
                  href={`/cards/listings/${listing.slug}`}
                  key={listing.id}
                  className={styles.card}
                >
                  <div className={styles.imageWrap}>
                    <img
                      src={listing.image_url}
                      alt={listing.name}
                      className={styles.image}
                    />
                  </div>

                  <div className={styles.content}>
                    <h2>{listing.name}</h2>

                    <div className={styles.meta}>
                      <span>{listing.set_code || "No set"}</span>
                      <span>{listing.rarity || "Unknown rarity"}</span>
                      <span>{listing.condition}</span>
                    </div>

                    <div className={styles.footer}>
                      <strong>{listing.price} EGP</strong>
                      <small>Seller: {listing.seller_username}</small>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Suspense fallback={null}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNext={!!next}
                hasPrevious={!!previous}
              />
            </Suspense>
          </>
        ) : (
          <p className={styles.empty}>No listings found.</p>
        )}
      </Container>
    </section>
  );
}