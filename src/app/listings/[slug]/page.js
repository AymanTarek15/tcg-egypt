import Container from "@/app/components/layout/Container/Container";
import { fetchAPI } from "@/lib/api";
import styles from "./ListingDetails.module.css";
import Link from "next/link";
import AddToCartButton from "@/app/components/cards/AddToCartButton/AddToCartButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ListingDetailsPage({ params }) {
  const { slug } = await params;
  // console.log(slug);

  let listing = null;

  try {
    listing = await fetchAPI(`/api/cards/listings/${slug}/`);
    console.log(listing);
  } catch (error) {
    console.error("Listing detail fetch error:", error.message);
  }

  if (!listing) {
    return (
      <section className={styles.notFound}>
        <Container>
          <p>Listing not found.</p>
        </Container>
      </section>
    );
  }
console.log(listing.name);

  return (
    <section className={styles.page}>
      <Container>
        <div className={styles.wrapper}>
          <div className={styles.gallerySection}>
            <img
              src={listing.image_url}
              alt={listing.name}
              className={styles.mainImage}
            />

            {listing.seller_images?.length > 0 && (
              <div className={styles.galleryGrid}>
                {listing.seller_images.map((img, index) => (
                  <img
                    key={`${img}-${index}`}
                    src={img}
                    alt={`${listing.name} seller image ${index + 1}`}
                    className={styles.galleryImage}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.title}>{listing.name}</h1>

            <div className={styles.priceTag}>{listing.price} EGP</div>

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <strong>Seller</strong>
                <span>{listing.seller_username}</span>
              </div>

              <div className={styles.metaItem}>
                <strong>Condition</strong>
                <span>{listing.condition}</span>
              </div>

              <div className={styles.metaItem}>
                <strong>Edition</strong>
                <span>{listing.edition}</span>
              </div>

              <div className={styles.metaItem}>
                <strong>Language</strong>
                <span>{listing.language}</span>
              </div>

              <div className={styles.metaItem}>
                <strong>Quantity</strong>
                <span>{listing.quantity}</span>
              </div>

              {listing.rarity && (
                <div className={styles.metaItem}>
                  <strong>Rarity</strong>
                  <span>{listing.rarity}</span>
                </div>
              )}
            </div>

            {listing.seller_description && (
              <div className={styles.descriptionBox}>
                <h3>Description</h3>
                <p>{listing.seller_description}</p>
              </div>
            )}

            <div className={styles.actions}>
              {/* <Link href={`/checkout/${listing.slug}`} className={styles.buyButton}>
  Buy Now
</Link> */}
<AddToCartButton listingId={listing.id} isSold={listing.is_sold} className={styles.addToCart} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}