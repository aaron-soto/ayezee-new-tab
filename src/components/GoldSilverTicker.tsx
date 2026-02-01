"use client";

import { useEffect, useState } from "react";

interface MetalPrice {
  price: number;
  currency: string;
}

interface PriceData {
  gold: MetalPrice | null;
  silver: MetalPrice | null;
  timestamp: number;
}

const CACHE_KEY = "metalPricesCache";
const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const API_KEY = "goldapi-1rjb19mddbci7s-io";

function GoldSilverTicker() {
  const [prices, setPrices] = useState<PriceData>({
    gold: null,
    silver: null,
    timestamp: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cachedData: PriceData = JSON.parse(cached);
          const now = Date.now();

          // If cache is still valid, use it
          if (now - cachedData.timestamp < CACHE_DURATION) {
            setPrices(cachedData);
            setLoading(false);
            return;
          }
        }

        // Fetch fresh data from API with authentication
        const [goldResponse, silverResponse] = await Promise.all([
          fetch("https://www.goldapi.io/api/XAU/USD", {
            headers: {
              "x-access-token": API_KEY,
            },
          }),
          fetch("https://www.goldapi.io/api/XAG/USD", {
            headers: {
              "x-access-token": API_KEY,
            },
          }),
        ]);

        if (!goldResponse.ok || !silverResponse.ok) {
          throw new Error("Failed to fetch prices");
        }

        const goldData = await goldResponse.json();
        const silverData = await silverResponse.json();

        const newPrices: PriceData = {
          gold: {
            price: goldData.price,
            currency: goldData.currency,
          },
          silver: {
            price: silverData.price,
            currency: silverData.currency,
          },
          timestamp: Date.now(),
        };

        // Save to cache
        localStorage.setItem(CACHE_KEY, JSON.stringify(newPrices));
        setPrices(newPrices);
        setError(false);
      } catch (err) {
        console.error("Error fetching metal prices:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();

    // Set up interval to refresh every 12 hours
    const interval = setInterval(fetchPrices, CACHE_DURATION);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <span className="text-muted-foreground text-sm">Loading prices...</span>
    );
  }

  if (error || !prices.gold || !prices.silver) {
    return (
      <span className="text-muted-foreground text-sm">
        Unable to load metal prices
      </span>
    );
  }

  return (
    <div className="text-muted-foreground flex items-center gap-4 text-sm">
      <span className="flex items-center gap-1">
        <span className="font-semibold text-yellow-500">🥇 Gold:</span>
        <span>${prices.gold.price.toFixed(2)}</span>
      </span>
      <span className="flex items-center gap-1">
        <span className="font-semibold text-gray-400">🥈 Silver:</span>
        <span>${prices.silver.price.toFixed(2)}</span>
      </span>
    </div>
  );
}

export default GoldSilverTicker;
