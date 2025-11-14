"use client";

import React, { useEffect, useRef } from "react";

import useSearchStore from "@/lib/stores/searchStore";

function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery } = useSearchStore();

  useEffect(() => {
    // Auto-focus the input on mount
    inputRef.current?.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      className="input min-w-3xs py-2!"
      type="text"
      placeholder="Search..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

export default SearchBar;
