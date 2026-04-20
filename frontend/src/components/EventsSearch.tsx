import { useEffect, useState } from "react";
import { Calendar, MapPin, Search } from "lucide-react";
import EventCard from "./EventCard";
import { useEventsSearch } from "../hooks/useEventsSearch";

export default function EventsSearch() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [page, setPage] = useState(1);

  // reset page on filter changes
  useEffect(() => {
    setPage(1);
  }, [q, category, location, dateFrom, dateTo, priceMin, priceMax]);

  const { data, loading, error } = useEventsSearch(
    {
      q,
      category,
      location,
      dateFrom,
      dateTo,
      priceMin,
      priceMax,
      page,
      limit: 12,
      sort: "starts_at",
      order: "asc"
    },
    { debounceMs: 300 }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Kërko evente</h1>
          <p className="text-lg md:text-xl text-white/90">Advanced search me kategori, datë, çmim dhe vend.</p>

          <div className="mt-8 bg-white rounded-3xl p-2 shadow-2xl flex items-center">
            <div className="flex-1 flex items-center gap-4 px-6">
              <Search className="text-gray-400" size={24} />
              <input
                type="text"
                placeholder="Kërko sipas titullit ose pershkrimit..."
                className="flex-1 outline-none text-black text-lg placeholder-gray-400"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="px-4 py-3 text-gray-600 text-sm">{loading ? "Duke kërkuar..." : null}</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              className="w-full border border-gray-300 rounded-2xl px-4 py-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Të gjitha</option>
              <option value="Teknologji">Teknologji</option>
              <option value="Muzikë">Muzikë</option>
              <option value="Sport">Sport</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vend</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3"
                placeholder="p.sh. Prishtina"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datë (nga)</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datë (deri)</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Çmimi min (€)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Çmimi max (€)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>

          <div className="lg:col-span-2 flex items-end">
            <button
              type="button"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 hover:bg-gray-100"
              onClick={() => {
                setQ("");
                setCategory("all");
                setLocation("");
                setDateFrom("");
                setDateTo("");
                setPriceMin("");
                setPriceMax("");
              }}
            >
              Pastro filtrat
            </button>
          </div>
        </div>

        {error ? <p className="mt-6 text-red-600">{error}</p> : null}

        <div className="mt-8 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">Rezultatet {data ? `(${data.total})` : ""}</h2>
          {data ? (
            <div className="text-sm text-gray-600">
              Faqja {data.page} / {data.totalPages}
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data?.items || []).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {data && data.totalPages > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              className="px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-50"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Mbrapa
            </button>
            <button
              className="px-4 py-2 rounded-xl border border-gray-300 disabled:opacity-50"
              disabled={page >= data.totalPages || loading}
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            >
              Para
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

