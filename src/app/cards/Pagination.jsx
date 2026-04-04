"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./Pagination.module.css";

export default function Pagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(page) {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function generatePages() {
    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return [...new Set(pages)];
  }

  const pages = generatePages();

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        disabled={!hasPrevious}
        onClick={() => goToPage(currentPage - 1)}
      >
        Prev
      </button>

      {pages.map((page, index) =>
        page === "..." ? (
          <span key={`dots-${index}`} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={`page-${page}-${index}`}
            onClick={() => goToPage(page)}
            className={`${styles.pageBtn} ${
              page === currentPage ? styles.active : ""
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        className={styles.pageBtn}
        disabled={!hasNext}
        onClick={() => goToPage(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
}