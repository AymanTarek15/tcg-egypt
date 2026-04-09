import Hero from "@/app/components/home/Hero/Hero";
import FeaturedCards from "@/app/components/home/FeaturedCards/FeaturedCards";
import LatestArticles from "@/app/components/home/LatestArticles/LatestArticles";
import TierListPreview from "@/app/components/home/TierListPreview/TierListPreview";
import { fetchAPI } from "@/lib/api";

export default async function HomePage() {
  let featuredCards = [];

  try {
    const [cardsData, listingsData, priceListingsData] = await Promise.all([
      fetchAPI("/api/cards/database/?is_featured=true"),
      fetchAPI("/api/cards/listings/?is_sold=false"),
      fetchAPI("/api/cards/listings/"),
    ]);

    const rawCards =
      cardsData.results || (Array.isArray(cardsData) ? cardsData : []);
    const activeListings =
      listingsData.results || (Array.isArray(listingsData) ? listingsData : []);
    const priceListings =
      priceListingsData.results ||
      (Array.isArray(priceListingsData) ? priceListingsData : []);

    const countMap = {};
    for (const listing of activeListings) {
      const cardId = listing.yugioh_card;
      if (!cardId) continue;

      if (!countMap[cardId]) {
        countMap[cardId] = 0;
      }

      countMap[cardId] += 1;
    }

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

    featuredCards = rawCards.map((card) => {
      const priceStats = priceMap[card.id];

      return {
        ...card,
        listing_count: countMap[card.id] || 0,
        avg_price: priceStats?.count
          ? (priceStats.totalPrice / priceStats.count).toFixed(2)
          : null,
      };
    });
  } catch (error) {
    console.error("Failed to fetch featured cards:", error.message);
  }

  return (
    <>
      <Hero />
      <FeaturedCards cards={featuredCards} />
      {/* <TierListPreview /> */}
      {/* <LatestArticles /> */}
    </>
  );
}