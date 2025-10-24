import React from "react";
import { Star } from "lucide-react";

export default function StockOfTheDay({ best, loading }) {
  if (loading) {
    return (
      <div className="rounded-2xl p-6 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <Star className="text-emerald-400 w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Stock of the Day
          </h2>
        </div>
        <div className="h-24 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl"></div>
      </div>
    );
  }

  if (!best) {
    return (
      <div className="rounded-2xl p-6 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          No featured stock available right now.
        </p>
      </div>
    );
  }

  // Dynamic color coding for status
  const statusColor =
    best.status === "Strong Buy"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      : best.status === "Strong Sell"
      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      : "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300";

  const changeColor =
    best.change_percent > 0
      ? "text-emerald-500"
      : best.change_percent < 0
      ? "text-red-500"
      : "text-slate-400";

  return (
    <div className="rounded-2xl p-6 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-3 mb-4">
        <Star className="text-amber-400 w-5 h-5" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Stock of the Day
        </h2>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          {best.symbol}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          {best.name || "Featured Company"}
        </p>

        <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
          ₹{best.price?.toFixed(2)}
        </div>

        <div className={`mt-1 text-sm font-semibold ${changeColor}`}>
          {best.change_percent > 0
            ? `+${best.change_percent.toFixed(2)}%`
            : `${best.change_percent.toFixed(2)}%`}
        </div>

        <div className={`mt-4 inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {best.status}
        </div>

        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
          Based on recent performance trends and volatility.
        </p>
      </div>
    </div>
  );
}
