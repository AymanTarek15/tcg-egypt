
import SectionTitle from "@/app/shared/sectionTitle/SectionTitle";
import Container from "../../layout/Container/Container";
import styles from "./FeaturedCards.module.css";
import CardItem from "../../cards/CardItem/CardItems";

export default function FeaturedCards({ cards = [] }) {
  // console.log(cards);
  return (
    <section className={styles.section}>
      <Container>
        <SectionTitle
          title="Featured Cards"
          subtitle="Popular listings and trending cards right now."
        />

      
        

        <div className={styles.cardsSlider}>
          {cards.length > 0 ? (
            cards.map((card) => (
              <div key={card.id} className={styles.cardSlide}>
                <CardItem card={card} />
              </div>
            ))
          ) : (
            <p>No featured cards available.</p>
          )}
        </div>
      </Container>
    </section>
  );
}