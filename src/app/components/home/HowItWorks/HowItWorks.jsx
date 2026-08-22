import styles from "./HowItWorks.module.css";
import Container from "../../layout/Container/Container";

const steps = [
  {
    n: "01",
    title: "Find your card",
    desc: "Search 13,000+ Yu-Gi-Oh cards and check live listings and market prices.",
    icon: (
      <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3" />
    ),
  },
  {
    n: "02",
    title: "List or buy",
    desc: "List cards you own in minutes, or add listings to your cart and check out.",
    icon: (
      <>
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
      </>
    ),
  },
  {
    n: "03",
    title: "Trade safely",
    desc: "Deal with verified local sellers across Egypt and grow your collection.",
    icon: (
      <>
        <path d="M20 6 9 17l-5-5" />
      </>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.head}>
          <span className={styles.eyebrow}>How it works</span>
          <h2 className={styles.title}>Start trading in three steps</h2>
        </div>

        <div className={styles.grid}>
          {steps.map((s) => (
            <div className={styles.card} key={s.n}>
              <div className={styles.top}>
                <span className={styles.iconWrap}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {s.icon}
                  </svg>
                </span>
                <span className={styles.num}>{s.n}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
