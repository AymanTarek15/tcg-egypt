import styles from "./CardFilters.module.css";

export default function CardFilters({
  type,
  setType,
  condition,
  setCondition,
}) {
  return (
    <div className={styles.filters}>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="All">All Types</option>
        <option value="Monster">Monster</option>
        <option value="Spell">Spell</option>
        <option value="Trap">Trap</option>
      </select>

      <select value={condition} onChange={(e) => setCondition(e.target.value)}>
        <option value="All">All Conditions</option>
        <option value="Mint">Mint</option>
        <option value="Near Mint">Near Mint</option>
        <option value="Lightly Played">Lightly Played</option>
      </select>
    </div>
  );
}