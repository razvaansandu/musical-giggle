"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ScrollRow.module.css";

export default function ScrollRow({ children, title, seeAllLink, rightElement }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkArrows = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkArrows();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", checkArrows);
      window.addEventListener("resize", checkArrows);
    }
    return () => {
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", checkArrows);
      }
      window.removeEventListener("resize", checkArrows);
    };
  }, [children]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleWheel = (e) => {
    if (!scrollRef.current) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;  
    
    e.preventDefault();
    scrollRef.current.scrollBy({
      left: e.deltaY,
      behavior: "auto",
    });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.headerRight}>
          {seeAllLink && (
            <a href={seeAllLink} className={styles.seeAllLink}>
              See all →
            </a>
          )}
          {rightElement}
        </div>
      </div>

      <div className={styles.scrollWrapper}>
        {showLeftArrow && (
          <button
            className={`${styles.arrowButton} ${styles.arrowLeft}`}
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          ref={scrollRef}
          className={styles.scrollRow}
          onWheel={handleWheel}
        >
          {children}
        </div>

        {showRightArrow && (
          <button
            className={`${styles.arrowButton} ${styles.arrowRight}`}
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </section>
  );
}
