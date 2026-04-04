
import Container from "../../layout/Container/Container";
import SectionTitle from "@/app/shared/sectionTitle/SectionTitle";

import styles from "./TierListPreview.module.css";

export default function TierListPreview() {
  const tiers = [
    { tier: "S", deck: "Branded Despia" },
    { tier: "A", deck: "Snake-Eye" },
    { tier: "A", deck: "Labrynth" },
    { tier: "B", deck: "Kashtira" },
  ];

  return (
    <section className={styles.section}>
      <Container>
        <SectionTitle
          title="Tier List Snapshot"
          subtitle="A quick view of strong decks in the current format."
        />

        <div className={styles.list}>
          {tiers.map((item, index) => (
            <div key={index} className={styles.row}>
              <span className={styles.tier}>{item.tier}</span>
              <span>{item.deck}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}