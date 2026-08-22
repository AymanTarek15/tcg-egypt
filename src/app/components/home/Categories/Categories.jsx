import Link from "next/link";
import styles from "./Categories.module.css";
import Container from "../../layout/Container/Container";

const categories = [
  {
    key: "Monster",
    label: "Monsters",
    desc: "Warriors, Dragons, Spellcasters & more",
    className: "monster",
    icon: (
      <path d="M12 2 4 6v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6l-8-4z" />
    ),
  },
  {
    key: "Spell",
    label: "Spells",
    desc: "Continuous, Quick-Play, Field & Equip",
    className: "spell",
    icon: <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />,
  },
  {
    key: "Trap",
    label: "Traps",
    desc: "Normal, Continuous & Counter traps",
    className: "trap",
    icon: (
      <>
        <path d="M12 2v6" />
        <path d="M5 8h14l-2 12H7L5 8z" />
      </>
    ),
  },
  {
    key: "",
    label: "All Cards",
    desc: "Browse the full 13,000+ catalog",
    className: "all",
    icon: (
      <>
        <rect x="3" y="4" width="14" height="16" rx="2" />
        <path d="M7 9h6M7 13h6" />
        <path d="M21 6v12a2 2 0 0 1-2 2" />
      </>
    ),
  },
];

export default function Categories() {
  return (
    <section className={styles.section}>
      <Container>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Browse by type</span>
          <h2 className={styles.title}>Find your cards, fast</h2>
        </div>

        <div className={styles.grid}>
          {categories.map((c) => (
            <Link
              key={c.label}
              href={c.key ? `/cards?card_type=${c.key}` : "/cards"}
              className={`${styles.tile} ${styles[c.className]}`}
            >
              <span className={styles.iconWrap}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {c.icon}
                </svg>
              </span>
              <div className={styles.body}>
                <h3>{c.label}</h3>
                <p>{c.desc}</p>
              </div>
              <span className={styles.arrow} aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
