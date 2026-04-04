"use client";

import { useMemo, useState } from "react";
import Container from "../components/layout/Container/Container";
import SectionTitle from "../shared/sectionTitle/SectionTitle";
import CardGrid from "../components/cards/CardGrid/CardGrid";
import SearchBar from "../components/cards/SearchBar/SearchBar";
import CardFilters from "../components/cards/CardFillters/CardFilters";
import { featuredCards } from "../components/home/data/dummyData";
import styles from "./CardsPage.module.css";

export default function CardsClient() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [condition, setCondition] = useState("All");

  const filteredCards = useMemo(() => {
    return featuredCards.filter((card) => {
      const matchSearch = card.name.toLowerCase().includes(search.toLowerCase());
      const matchType = type === "All" || card.type === type;
      const matchCondition =
        condition === "All" || card.condition === condition;

      return matchSearch && matchType && matchCondition;
    });
  }, [search, type, condition]);

  return (
    <section className={styles.page}>
      <Container>
        <SectionTitle
          title="Browse Cards"
          subtitle="Search and filter listings from sellers."
        />

        <div className={styles.topBar}>
          <SearchBar value={search} onChange={setSearch} />
          <CardFilters
            type={type}
            setType={setType}
            condition={condition}
            setCondition={setCondition}
          />
        </div>

        <CardGrid cards={filteredCards} />
      </Container>
    </section>
  );
}