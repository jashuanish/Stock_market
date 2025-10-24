import React from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function TrendingNow({ trending = [], loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl p-6 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="text-emerald-400 w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Trending Now
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const hasData = trending && trending.length > 0;
  const fallback = !hasData
    ? [
        { symbol: "AAPL", name: "Apple Inc.", price: 176.54, change_percent: 0.86 },
        { symbol: "TSLA", name: "Tesla Inc.", price: 255.21, change_percent: 1.45 },
        { symbol: "NVDA", name: "NVIDIA Corp.", price: 438.76, change_percent: -0.65 },
        { symbol: "AMZN", name: "Amazon.com Inc.", price: 138.22, change_percent: 0.32 },
        { symbol: "MSFT", name: "Microsoft Corp.", price: 312.45, change_percent: -0.12 },
      ]
    : [];

  const dataToShow = hasData ? trending : fallback;

  return (
    <div className="rounded-2xl p-6 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md transition-all duration-300 hover:scale-[1.01]">
      <div className="flex items-center gap-3 mb-4">
        <Activity className="text-cyan-400 w-5 h-5" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Trending Now
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
              className={`flex items-center justify-between px-4 py-3 rounded-xl ${trendBg} hover:shadow-md transition-all duration-200`}
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {stock.symbol}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stock.name || "—"}
                </p>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  ₹{stock.price?.toFixed(2)}
                </div>
                <div className={`flex items-center justify-end gap-1 text-xs font-medium ${trendColor}`}>
                  {positive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : stock.change_percent < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : null}
                  {stock.change_percent?.toFixed(2)}%
                </div>
              </div>
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
