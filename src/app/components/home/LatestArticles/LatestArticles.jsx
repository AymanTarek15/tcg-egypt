
import Container from "../../layout/Container/Container";
import SectionTitle from "@/app/shared/sectionTitle/SectionTitle";
import { latestArticles } from "../data/dummyData";
import styles from "./LatestArticles.module.css";



export default function LatestArticles() {
  return (
    <section className={styles.section}>
      <Container>
        <SectionTitle
          title="Latest Articles"
          subtitle="Meta updates, card guides, and community insights."
        />

        <div className={styles.grid}>
          {latestArticles.map((article) => (
            <article key={article.id} className={styles.card}>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <button>Read More</button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}