import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type EventItem = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  location: string;
  starts_at: string;
  price_eur: number;
  image_url: string | null;
};

export type EventsResponse = {
  items: EventItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type EventsSearchFilters = {
  q: string;
  category: string; // "all" or category name
  location: string;
  dateFrom: string; // yyyy-mm-dd
  dateTo: string; // yyyy-mm-dd
  priceMin: string;
  priceMax: string;
  page: number;
  limit: number;
  sort: "starts_at" | "price_eur" | "title" | "created_at";
  order: "asc" | "desc";
};

function toIsoDateOnly(date: Date) {
  // backend expects ISO with offset; keep UI as yyyy-mm-dd
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
}

export function useEventsSearch(filters: EventsSearchFilters, options?: { debounceMs?: number }) {
  const debounceMs = options?.debounceMs ?? 300;

  const [data, setData] = useState<EventsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.q.trim()) params.set("q", filters.q.trim());
    if (filters.category !== "all") params.set("category", filters.category);
    if (filters.location.trim()) params.set("location", filters.location.trim());
    if (filters.dateFrom) params.set("dateFrom", toIsoDateOnly(new Date(filters.dateFrom)));
    if (filters.dateTo) params.set("dateTo", toIsoDateOnly(new Date(filters.dateTo)));
    if (filters.priceMin !== "") params.set("priceMin", filters.priceMin);
    if (filters.priceMax !== "") params.set("priceMax", filters.priceMax);
    params.set("page", String(filters.page));
    params.set("limit", String(filters.limit));
    params.set("sort", filters.sort);
    params.set("order", filters.order);
    return params.toString();
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/events?${queryString}`);
        const json = (await res.json()) as EventsResponse & { message?: string };
        if (!res.ok) throw new Error(json.message || "Kerkimi deshtoi.");
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Gabim i papritur.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [queryString, debounceMs]);

  return { data, loading, error };
}

