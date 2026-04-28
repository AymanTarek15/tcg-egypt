"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./ListingsToolbar.module.css";

export default function ListingsToolbar() {
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
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
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
          placeholder="Search listings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <button type="submit" className={styles.searchBtn}>
          Search
        </button>

        <button type="button" className={styles.clearBtn} onClick={handleClear}>
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
          value={searchParams.get("condition") || "All"}
          onChange={(e) => pushWithParam("condition", e.target.value)}
        >
          <option value="All">All Conditions</option>
          <option value="mint">Mint</option>
          <option value="near_mint">Near Mint</option>
          <option value="light_played">Light Played</option>
          <option value="moderate_played">Moderate Played</option>
          <option value="heavy_played">Heavy Played</option>
          <option value="damaged">Damaged</option>
        </select>

        <select
          value={searchParams.get("language") || "All"}
          onChange={(e) => pushWithParam("language", e.target.value)}
        >
          <option value="All">All Languages</option>
          <option value="English">English</option>
          <option value="Arabic">Arabic</option>
          <option value="Japanese">Japanese</option>
          <option value="German">German</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
          <option value="Italian">Italian</option>
          <option value="Portuguese">Portuguese</option>
        </select>

        <select
          value={searchParams.get("edition") || "All"}
          onChange={(e) => pushWithParam("edition", e.target.value)}
        >
          <option value="All">All Editions</option>
          <option value="1st Edition">1st Edition</option>
          <option value="Unlimited">Unlimited</option>
          <option value="Limited Edition">Limited Edition</option>
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
          <option value="-quantity">Quantity: High to Low</option>
        </select>
      </div>
    </div>
  );
}