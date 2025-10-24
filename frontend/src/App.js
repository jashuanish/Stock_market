import React, { useState, useEffect, useCallback } from "react";
import { TrendingUp, Sparkles, BarChart3, Star, SunMoon } from "lucide-react";
import StockOfTheDay from "./components/StockOfTheDay";
import TopStocks from "./components/TopStocks";
import TrendingNow from "./components/TrendingNow";
import "./index.css"; // Tailwind + custom styles

const NAV = [
  { name: "Trending", href: "#trending-now", icon: TrendingUp },
  { name: "Top Stocks", href: "#top-stocks", icon: BarChart3 },
  { name: "Featured", href: "#featured-stock", icon: Star },
];

export default function App() {
  const [stocks, setStocks] = useState([]);
  const [trending, setTrending] = useState([]);
  const [best, setBest] = useState(null);
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normalize backend payloads
  const normalizeStocks = (arr) =>
    (Array.isArray(arr) ? arr : []).map((s) => {
      const change =
        s.change_percent ??
        s.change ??
        s.pct ??
        s["percent_change"] ??
        0;

      return {
        symbol: s.symbol || s.Symbol || (s.t && s.t.toUpperCase()) || "N/A",
        name: s.name || s.Name || s.company || s.description || "",
        price:
          s.price ??
          s.current_price ??
          s.c ??
          s["current"] ??
          s["latestPrice"] ??
          0,
        change_percent: change,
        volume: s.volume ?? s.v ?? s["volume"] ?? 0,
        status:
          s.status ||
          s.signal ||
          (change > 2
            ? "Strong Buy"
            : change < -2
            ? "Strong Sell"
            : "Hold"),
      };
    });

  const normalizeBest = (b) => {
    if (!b) return null;
    const change = b.change_percent ?? b.change ?? 0;
    return {
      symbol: b.symbol || b.Symbol || b.t,
      price: b.price ?? b.current_price ?? b.c ?? 0,
      change_percent: change,
      name: b.name || "",
      status:
        b.status ||
        b.signal ||
        (change > 2 ? "Strong Buy" : change < -2 ? "Strong Sell" : "Hold"),
    };
  };

  // Single unified fetch
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [stocksRes, bestRes, trendingRes] = await Promise.all([
        fetch("http://localhost:8080/stocks"),
        fetch("http://localhost:8080/best"),
        fetch("http://localhost:8080/trending"),
      ]);

      if (!stocksRes.ok) throw new Error("Backend /stocks error");
      if (!bestRes.ok) throw new Error("Backend /best error");
      if (!trendingRes.ok) throw new Error("Backend /trending error");

      const stocksData = await stocksRes.json();
      const bestData = await bestRes.json();
      const trendingData = await trendingRes.json();

      const normalizedStocks = normalizeStocks(stocksData);
      const normalizedBest = normalizeBest(bestData);

      // Fallback: if trending is empty, use sorted stocks
      const normalizedTrending =
        Array.isArray(trendingData) && trendingData.length > 0
          ? normalizeStocks(trendingData).slice(0, 5)
          : normalizedStocks
              .slice()
              .sort((a, b) => (b.change_percent || 0) - (a.change_percent || 0))
              .slice(0, 5);

      setStocks(normalizedStocks);
      setBest(normalizedBest);
      setTrending(normalizedTrending);
      setError(null);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message || "Unknown backend error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Theme handler
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Initial + interval refresh
  useEffect(() => {
    loadData();
    const id = setInterval(loadData, 5000);
    return () => clearInterval(id);
  }, [loadData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 transition-colors duration-400">
      {/* Navbar */}
      <header className="fixed w-full z-40 top-0 left-0 backdrop-blur-sm bg-white/30 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between h-20 px-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-md bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/10">
              <Sparkles className="text-emerald-500 dark:text-emerald-300" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Stock Market Analyzer
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time insights — built with C (backend) + React
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex gap-2">
              {NAV.map((n) => (
                <a
                  key={n.name}
                  href={n.href}
                  className="px-3 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <n.icon className="w-4 h-4" />
                    {n.name}
                  </div>
                </a>
              ))}
            </nav>

            <button
              onClick={() => setDark((d) => !d)}
              title="Toggle theme"
              className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:scale-[1.02] transition"
            >
              <SunMoon className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="pt-28 pb-20">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Hero Section */}
          <section className="mb-8">
            <div className="rounded-2xl p-8 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    Market Pulse — Live
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Updated every 5 seconds • Source: local C backend
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Stocks tracked
                    </div>
                    <div className="text-2xl font-semibold text-slate-900 dark:text-white">
                      {stocks.length || 0}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Status
                    </div>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium ${
                        error
                          ? "bg-red-200 text-red-800"
                          : loading
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                      }`}
                    >
                      {error ? `Error` : loading ? `Loading` : `Live`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Grid Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div id="trending-now" className="lg:col-span-4">
              <TrendingNow trending={trending} loading={loading} />
            </div>

            <div id="top-stocks" className="lg:col-span-5">
              <TopStocks stocks={stocks} loading={loading} />
            </div>

            <div id="featured-stock" className="lg:col-span-3">
              <StockOfTheDay best={best} loading={loading} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/40 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 text-sm text-slate-600 dark:text-slate-300 flex justify-between">
          <div>Built with ⚛️ React + 💻 C backend</div>
          <div>© {new Date().getFullYear()} Smart Stock Tracker</div>
        </div>
      </footer>
    </div>
  );
}
