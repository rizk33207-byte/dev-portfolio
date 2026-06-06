"use client";

import { useEffect } from "react";

export default function AnalyticsTracker() {
  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page: "/" }),
    }).catch((err) => {
      console.error("Failed to post analytics view:", err);
    });
  }, []);

  return null;
}
