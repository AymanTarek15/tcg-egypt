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
            <Link href="/cards" className={styles.backLink}>
              ← Back to cards
            </Link>

            <h1 className={styles.title}>{card.name}</h1>

            <div className={styles.badgeRow}>
              <span className={styles.typeBadge}>
                {card.human_readable_card_type || card.card_type}
              </span>
              {card.archetype && (
                <span className={styles.archetypeBadge}>{card.archetype}</span>
              )}
            </div>

            {card.desc && <p className={styles.description}>{card.desc}</p>}

            {(card.attribute ||
              card.race ||
              card.level != null ||
              card.atk != null ||
              card.defense != null) && (
              <div className={styles.metaGrid}>
                {card.attribute && (
                  <div className={styles.metaCard}>
                    <span className={styles.metaLabel}>Attribute</span>
                    <span className={styles.metaValue}>{card.attribute}</span>
                  </div>
                )}
                {card.race && (
                  <div className={styles.metaCard}>
                    <span className={styles.metaLabel}>Type</span>
                    <span className={styles.metaValue}>{card.race}</span>
                  </div>
                )}
                {card.level != null && (
                  <div className={styles.metaCard}>
                    <span className={styles.metaLabel}>Level / Rank</span>
                    <span className={styles.metaValue}>{card.level}</span>
                  </div>
                )}
                {card.atk != null && (
                  <div className={styles.metaCard}>
                    <span className={styles.metaLabel}>ATK</span>
                    <span className={styles.metaValue}>{card.atk}</span>
                  </div>
                )}
                {card.defense != null && (
                  <div className={styles.metaCard}>
                    <span className={styles.metaLabel}>DEF</span>
                    <span className={styles.metaValue}>{card.defense}</span>
                  </div>
                )}
              </div>
            )}

            <div className={styles.availability}>
              {totalListings > 0 ? (
                <>
                  <span className={styles.availDot} />
                  <span className={styles.availText}>
                    <strong>{totalListings}</strong> listing
                    {totalListings === 1 ? "" : "s"} available
                  </span>
                  <a href="#versions" className={styles.availLink}>
                    View listings ↓
                  </a>
                </>
              ) : (
                <>
                  <span className={styles.availText}>Not listed yet.</span>
                  <Link href="/sell" className={styles.availLink}>
                    Have this card? Sell it →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.listingsSection} id="versions">
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
                              {/* <span>{listing.quantity}</span> */}
                              <span>{listing.is_sold ? "Sold" : "Available"}</span>
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
                            <AddToCartButton listingId={listing.id} isSold={listing.is_sold}  />
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