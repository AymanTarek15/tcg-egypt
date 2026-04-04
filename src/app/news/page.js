
import { latestArticles } from "../components/home/data/dummyData";
import Container from "../components/layout/Container/Container";
import SectionTitle from "../shared/sectionTitle/SectionTitle";
import styles from "./NewsPage.module.css";

export default function NewsPage() {
  return (
    <section className={styles.page}>
      <Container>
        <SectionTitle
          title="News"
          subtitle="Community announcements, tournament coverage, and important updates."
        />

        <div className={styles.grid}>
          {latestArticles.map((article) => (
            <article key={article.id} className={styles.card}>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
              <button>Open Article</button>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}