"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./CardsToolbar.module.css";

export default function CardsToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  function pushWithParam(key, value) {
  const params = new URLSearchParams(searchParams.toString());

  if (!value || value === "All") {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  params.delete("page");

  const queryString = params.toString();
  const url = queryString ? `${pathname}?${queryString}` : pathname;

  router.push(url);
}

  function handleSearchSubmit(e) {
    e.preventDefault();
    pushWithParam("search", search.trim());
  }

  function handleClear() {
    setSearch("");
    router.push(pathname);
  }

  return (
    <div className={styles.toolbar}>
  <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
    <input
      type="text"
      placeholder="Search cards..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className={styles.searchInput}
    />

    <button type="submit" className={styles.searchBtn}>
      Search
    </button>

    <button
      type="button"
      className={styles.clearBtn}
      onClick={handleClear}
    >
      Clear
    </button>
  </form>

  <div className={styles.filters}>
    <select
      value={searchParams.get("card_type") || "All"}
      onChange={(e) => pushWithParam("card_type", e.target.value)}
    >
      <option value="All">All Types</option>
      <option value="Monster">Monster</option>
      <option value="Spell">Spell</option>
      <option value="Trap">Trap</option>
    </select>

    <select
      value={searchParams.get("ordering") || "All"}
      onChange={(e) => pushWithParam("ordering", e.target.value)}
    >
      <option value="All">Default Sort</option>
      <option value="-created_at">Newest</option>
      <option value="created_at">Oldest</option>
      <option value="price">Price: Low to High</option>
      <option value="-price">Price: High to Low</option>
      <option value="name">Name: A to Z</option>
      <option value="-name">Name: Z to A</option>
    </select>
  </div>
</div>
  );
}