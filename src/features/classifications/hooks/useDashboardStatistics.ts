import { useState, useEffect } from "react";
import { getDashboardStatistics } from "../api/classifications.api";
import type { DashboardStatistics } from "../types/classification.types";

export function useDashboardStatistics() {
  const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDashboardStatistics();
        setStatistics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch statistics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return { statistics, isLoading, error };
}
