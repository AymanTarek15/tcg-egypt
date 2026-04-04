import styles from "./SearchBar.module.css";

export default function SearchBar({ value, onChange }) {
  return (
    <div className={styles.searchWrap}>
      <input
        type="text"
        placeholder="Search cards..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.search}
      />
    </div>
  );
}