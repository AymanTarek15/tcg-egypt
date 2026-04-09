import { Suspense } from "react";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Container from "@/app/components/layout/Container/Container";
import SectionTitle from "@/app/shared/sectionTitle/SectionTitle";
import CardGrid from "@/app/components/cards/CardGrid/CardGrid";
import CardsToolbar from "./CardsToolbar";
import Pagination from "./Pagination";
import { fetchAPI } from "@/lib/api";

export default async function CardsPage({ searchParams }) {
  const params = await searchParams;

  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v && v !== "All")
  );

  const queryString = new URLSearchParams(cleanParams).toString();

  const cardsEndpoint = `/api/cards/database/${queryString ? `?${queryString}` : ""}`;
  const listingsEndpoint = `/api/cards/listings/?is_sold=false`; // for listing count only
  const listingPriceEndpoint = `/api/cards/listings/`; // for average price only

  let cards = [];
  let count = 0;
  let next = null;
  let previous = null;

  try {
    const [cardsData, listingsData, priceListingsData] = await Promise.all([
      fetchAPI(cardsEndpoint),
      fetchAPI(listingsEndpoint),
      fetchAPI(listingPriceEndpoint),
    ]);

    const rawCards = cardsData.results || (Array.isArray(cardsData) ? cardsData : []);
    const activeListings =
      listingsData.results || (Array.isArray(listingsData) ? listingsData : []);
    const priceListings =
      priceListingsData.results || (Array.isArray(priceListingsData) ? priceListingsData : []);

    // Map for active unsold listings count
    const countMap = {};

    for (const listing of activeListings) {
      const cardId = listing.yugioh_card;
      if (!cardId) continue;

      if (!countMap[cardId]) {
        countMap[cardId] = 0;
      }

      countMap[cardId] += 1;
    }

    // Map for average price from all listings
    const priceMap = {};

    for (const listing of priceListings) {
      const cardId = listing.yugioh_card;
      if (!cardId) continue;

      if (!priceMap[cardId]) {
        priceMap[cardId] = {
          count: 0,
          totalPrice: 0,
        };
      }

      priceMap[cardId].count += 1;
      priceMap[cardId].totalPrice += Number(listing.price || 0);
    }

    cards = rawCards.map((card) => {
      const priceStats = priceMap[card.id];

      return {
        ...card,
        listing_count: countMap[card.id] || 0,
        avg_price: priceStats?.count
          ? (priceStats.totalPrice / priceStats.count).toFixed(2)
          : null,
      };
    });

    count = cardsData.count || rawCards.length || 0;
    next = cardsData.next || null;
    previous = cardsData.previous || null;
  } catch (error) {
    console.error("Fetch Error:", error.message);
  }

  const currentPage = Number(params.page || 1);
  const PAGE_SIZE = 20;
  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <section style={{ padding: "60px 0" }}>
      <Container>
        <SectionTitle
          title="Browse Cards"
          subtitle="Search, sort, and filter cards."
        />

        <Suspense fallback={<div>Loading Filters...</div>}>
          <CardsToolbar />
        </Suspense>

        {cards.length > 0 ? (
          <>
            <CardGrid cards={cards} />
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
          <p style={{ marginTop: "20px" }}>No cards found.</p>
        )}
      </Container>
    </section>
  );
}