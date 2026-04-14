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
  const listingsEndpoint = `/api/cards/listings/?is_sold=false`;
  const listingPriceEndpoint=`/api/cards/listings/?is_sold=true`;

  let cards = [];
  let count = 0;
  let next = null;
  let previous = null;

  try {
    const [cardsData, listingsData] = await Promise.all([
      fetchAPI(cardsEndpoint),
      fetchAPI(listingsEndpoint),
    ]);

    const rawCards = cardsData.results || (Array.isArray(cardsData) ? cardsData : []);
    const listings = listingsData.results || (Array.isArray(listingsData) ? listingsData : []);

    const listingsMap = {};

    for (const listing of listings) {
      const cardId = listing.yugioh_card;

      if (!cardId) continue;

      if (!listingsMap[cardId]) {
        listingsMap[cardId] = {
          count: 0,
          totalPrice: 0,
        };
      }

      listingsMap[cardId].count += 1;
      listingsMap[cardId].totalPrice += Number(listing.price || 0);
    }

    cards = rawCards.map((card) => {
      const stats = listingsMap[card.id];

      return {
        ...card,
        listing_count: stats?.count || 0,
        avg_price: stats?.count
          ? (stats.totalPrice / stats.count).toFixed(2)
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