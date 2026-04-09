import Container from "@/app/components/layout/Container/Container";
import { fetchAPI } from "@/lib/api";
import styles from "./CardDetails.module.css";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CardDetailPage({ params }) {
  const { slug } = await params;

  let card = null;
  let listings = [];

  try {
    card = await fetchAPI(`/api/cards/database/${slug}/`);

    const listingsData = await fetchAPI(`/api/cards/listings/?is_sold=false`);

    const allListings =
      listingsData.results || (Array.isArray(listingsData) ? listingsData : []);

    listings = allListings.filter(
      (listing) =>
        listing.name?.trim().toLowerCase() === card.name?.trim().toLowerCase(),
    );
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
  console.log(listings);
  

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
            <h2 className={styles.sectionTitle}>Listings</h2>
            <span className={styles.listingCountBadge}>
              {listings.length} found
            </span>
          </div>

          {listings.length === 0 ? (
            <div className={styles.emptyState}>
              No listings for this card yet.
            </div>
          ) : (
            <div className={styles.listingsGrid}>
              {listings.map((listing) => (
                <div key={listing.id} className={styles.listingCard}>
                  <img
                    src={listing.image_url}
                    alt={listing.name}
                    className={styles.listingImage}
                  />

                  <div className={styles.listingBody}>
                    <h3 className={styles.listingTitle}>{listing.name}</h3>

                    <div className={styles.priceTag}>{listing.price} EGP</div>

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
                    </div>

                    <div className={styles.actions}>
                      <Link
                        href={`/listings/${listing.slug}`}
                        className={styles.viewButton}
                      >
                        View Listing
                      </Link>

  {/* <div className={styles.actions}>
              <Link href={`/checkout/${listing.slug}`} className={styles.buyButton}>
  Buy Now
</Link>
            </div> */}
                      <Link href={`/checkout/${listing.slug}`} className={styles.buyButton}>
  Buy Now
</Link>
                    </div>
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
