import Hero from "@/app/components/home/Hero/Hero";
import FeaturedCards from "@/app/components/home/FeaturedCards/FeaturedCards";
import LatestArticles from "@/app/components/home/LatestArticles/LatestArticles";
import TierListPreview from "@/app/components/home/TierListPreview/TierListPreview";
import { fetchAPI } from "@/lib/api";

export default async function HomePage() {
  let featuredCards = [];

  try {
    featuredCards = await fetchAPI("/api/cards/database/?is_featured=true");
    // console.log(featuredCards.results[0]);
    
  } catch (error) {
    console.error("Failed to fetch featured cards:", error.message);
  }

  return (
    <>
      <Hero />
      <FeaturedCards cards={featuredCards.results} />
      <TierListPreview />
      <LatestArticles />
    </>
  );
}