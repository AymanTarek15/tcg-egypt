import styles from "./SectionTitle.module.css";

export default function SectionTitle({ title, subtitle }) {
  return (
    <div className={styles.heading}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}