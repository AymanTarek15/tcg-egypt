
import { latestArticles } from "../components/home/data/dummyData";
import Container from "../components/layout/Container/Container";
import SectionTitle from "../shared/sectionTitle/SectionTitle";
import styles from "./MetaPage.module.css";

export default function MetaPage() {
  return (
    <section className={styles.page}>
      <Container>
        <SectionTitle
          title="Meta Updates"
          subtitle="Follow format shifts, deck trends, and important changes."
        />

        <div className={styles.grid}>
          {latestArticles.map((article) => (
            <article key={article.id} className={styles.card}>
              <span className={styles.tag}>{article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <small>{article.date}</small>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}