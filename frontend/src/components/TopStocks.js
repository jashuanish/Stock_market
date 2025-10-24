import React, { useEffect, useState, useRef } from "react";
import { ArrowUpRight, ArrowDownRight, Star } from "lucide-react";

export default function TopStocks({ topStocks = [], loading }) {
  const [displayStocks, setDisplayStocks] = useState(topStocks);
  const prevStocksRef = useRef(topStocks);

  useEffect(() => {
    if (!topStocks || topStocks.length === 0) return;

    // Update only if data changed
    if (JSON.stringify(topStocks) !== JSON.stringify(prevStocksRef.current)) {
      setDisplayStocks(topStocks);
      prevStocksRef.current = topStocks;
    }
  }, [topStocks]);

  if (loading) {
    return (
      <div className="rounded-2xl p-6 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <Star className="text-yellow-400 w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Top Stocks
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const hasData = displayStocks && displayStocks.length > 0;

  const fallback = !hasData
    ? [
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 176.54,
          change_percent: 0.86,
          rating: "Strong Buy",
        },
        {
          symbol: "MSFT",
          name: "Microsoft Corp.",
          price: 312.45,
          change_percent: 0.72,
          rating: "Buy",
        },
        {
          symbol: "TSLA",
          name: "Tesla Inc.",
          price: 255.21,
          change_percent: -0.32,
          rating: "Hold",
        },
        {
          symbol: "NVDA",
          name: "NVIDIA Corp.",
          price: 438.76,
          change_percent: 1.24,
          rating: "Strong Buy",
        },
        {
          symbol: "AMZN",
          name: "Amazon.com Inc.",
          price: 138.22,
          change_percent: 0.18,
          rating: "Buy",
        },
      ]
    : [];

  const dataToShow = hasData ? displayStocks.slice(0, 5) : fallback;

  const getBadgeStyle = (rating) => {
    switch (rating?.toLowerCase()) {
      case "strong buy":
        return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "buy":
        return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400";
      case "hold":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400";
      case "sell":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400";
    }
  };

  return (
    <div className="rounded-2xl p-6 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-md transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <Star className="text-yellow-400 w-5 h-5" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Top Stocks
        </h2>
      </div>

      <div className="space-y-4">
        {dataToShow.map((stock, idx) => {
          const positive = stock.change_percent > 0;
          const trendColor = positive
            ? "text-emerald-500"
            : stock.change_percent < 0
            ? "text-red-500"
            : "text-slate-400";
          const trendBg = positive
            ? "bg-emerald-50 dark:bg-emerald-900/10"
            : stock.change_percent < 0
            ? "bg-red-50 dark:bg-red-900/10"
            : "bg-slate-100/60 dark:bg-slate-900/40";

          return (
            <div
              key={stock.symbol || idx}
              className={`flex items-center justify-between px-4 py-3 rounded-xl ${trendBg} hover:shadow-md transition-all duration-300`}>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-900 dark:text-white w-8 text-center">
                  #{idx + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white transition-all duration-300">
                    {stock.symbol}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {stock.name || "—"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900 dark:text-white transition-all duration-300">
                  ₹{stock.price?.toFixed(2)}
                </div>
                <div
                  className={`flex items-center justify-end gap-1 text-xs font-medium ${trendColor} transition-all duration-300`}>
                  {positive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : stock.change_percent < 0 ? (
                    <ArrowDownRight className="w-3 h-3" />
                  ) : null}
                  {stock.change_percent?.toFixed(2)}%
                </div>
              </div>

              <span
                className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full transition-all duration-300 ${getBadgeStyle(
                  stock.rating
                )}`}>
                {stock.rating || "—"}
              </span>
            </div>
          );
        })}
      </div>

      {!hasData && (
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 italic text-center">
          Showing sample data — waiting for live updates...
        </p>
      )}
    </div>
  );
}
