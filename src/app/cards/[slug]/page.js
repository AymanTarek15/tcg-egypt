import Container from "@/app/components/layout/Container/Container";
import { fetchAPI } from "@/lib/api";
import styles from "./CardDetails.module.css";
import Link from "next/link";
import AddToCartButton from "@/app/components/cards/AddToCartButton/AddToCartButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CardDetailPage({ params }) {
  const { slug } = await params;

  let card = null;
  let listings = [];

  try {
    card = await fetchAPI(`/api/cards/database/${slug}/`);

    const listingsData = await fetchAPI(
      `/api/cards/listings/?yugioh_card=${card.id}&is_sold=false`
    );

    listings =
      listingsData.results || (Array.isArray(listingsData) ? listingsData : []);
  } catch (error) {
    console.error("Card detail fetch error:", error.message);
  }

  if (!card) {
    return (
      <section className={styles.notFound}>
        <Container>
          <p>Card not found.</p>
        </Container>
      </section>
    );
  }

  const groupedSets = (card.sets || [])
    .map((set) => {
      const setListings = listings.filter(
        (listing) => listing.yugioh_card_set === set.id
      );

      return {
        ...set,
        listings: setListings,
      };
    })
    .filter((set) => set.listings.length > 0);

  const totalListings = groupedSets.reduce(
    (sum, set) => sum + set.listings.length,
    0
  );

  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.cardSection}>
          <div className={styles.imagePanel}>
            <img
              src={card.main_image || card.images?.[0]?.image_url}
              alt={card.name}
              className={styles.mainImage}
            />
          </div>

          <div className={styles.infoPanel}>
            <h1 className={styles.title}>{card.name}</h1>
            <p className={styles.description}>{card.desc}</p>
          </div>
        </div>

        <div className={styles.listingsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Card Versions</h2>
            <span className={styles.listingCountBadge}>
              {totalListings} listing{totalListings === 1 ? "" : "s"} found
            </span>
          </div>

          {groupedSets.length === 0 ? (
            <div className={styles.emptyState}>
              No listings for this card yet.
            </div>
          ) : (
            <div className={styles.versionsWrapper}>
              {groupedSets.map((set) => (
                <div key={set.id} className={styles.versionBlock}>
                  <div className={styles.versionHeader}>
                    <h3 className={styles.versionTitle}>
                      {set.set_code} {set.set_rarity ? `— ${set.set_rarity}` : ""}
                    </h3>
                    <p className={styles.versionSubtitle}>{set.set_name}</p>
                    <span className={styles.versionCount}>
                      {set.listings.length} listing
                      {set.listings.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className={styles.listingsGrid}>
                    {set.listings.map((listing) => (
                      <div key={listing.id} className={styles.listingCard}>
                        <img
                          src={listing.image_url}
                          alt={listing.name}
                          className={styles.listingImage}
                        />

                        <div className={styles.listingBody}>
                          <h3 className={styles.listingTitle}>
                            {listing.name}
                          </h3>

                          <div className={styles.priceTag}>
                            {listing.price} EGP
                          </div>

                          <div className={styles.listingMetaGrid}>
                            <div className={styles.listingMetaItem}>
                              <strong>Seller</strong>
                              <span>{listing.seller_username}</span>
                            </div>

                            <div className={styles.listingMetaItem}>
                              <strong>Condition</strong>
                              <span>{listing.condition}</span>
                            </div>

                            <div className={styles.listingMetaItem}>
                              <strong>Edition</strong>
                              <span>{listing.edition}</span>
                            </div>

                            <div className={styles.listingMetaItem}>
                              <strong>Language</strong>
                              <span>{listing.language}</span>
                            </div>

                            <div className={styles.listingMetaItem}>
                              <strong>Quantity</strong>
                              <span>{listing.quantity}</span>
                            </div>

                            {listing.rarity && (
                              <div className={styles.listingMetaItem}>
                                <strong>Rarity</strong>
                                <span>{listing.rarity}</span>
                              </div>
                            )}

                            {listing.set_code && (
                              <div className={styles.listingMetaItem}>
                                <strong>Set Code</strong>
                                <span>{listing.set_code}</span>
                              </div>
                            )}
                          </div>

                          <div className={styles.actions}>
                            <Link
                              href={`/listings/${listing.slug}`}
                              className={styles.viewButton}
                            >
                              View Listing
                            </Link>

                            {/* <Link
                              href={`/checkout/${listing.slug}`}
                              className={styles.buyButton}
                            >
                              Buy Now
                            </Link> */}
                            <AddToCartButton  listingId={listing.id} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}