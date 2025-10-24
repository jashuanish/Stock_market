import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

export default function StockOfTheDay({ best, loading }) {
  const [displayStock, setDisplayStock] = useState(best);

  useEffect(() => {
    if (!best) return;

    // Compare previous and new data before updating
    if (JSON.stringify(best) !== JSON.stringify(displayStock)) {
      setDisplayStock(best);
    }
  }, [best, displayStock]);

  if (loading || !displayStock) {
    return (
      <div className="rounded-2xl p-6 bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <Star className="text-emerald-400 w-5 h-5" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Stock of the Day
          </h2>
        </div>
        <div className="h-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl"></div>
      </div>
    );
  }

  const bestStock = displayStock;

  const statusColor =
    bestStock.status === "Strong Buy"
      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
      : bestStock.status === "Strong Sell"
      ? "bg-red-500/10 text-red-500 border border-red-500/20"
      : "bg-slate-500/10 text-slate-500 border border-slate-500/20";

  const changeColor =
    bestStock.change_percent > 0
      ? "text-emerald-500"
      : bestStock.change_percent < 0
      ? "text-red-500"
      : "text-slate-400";

  return (
    <div className="rounded-2xl p-6 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-lg transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
      <div className="flex items-center justify-center gap-2 mb-5">
        <Star className="text-amber-400 w-5 h-5 drop-shadow-sm" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">
          Stock of the Day
        </h2>
      </div>

      <div className="text-center space-y-2 transition-all duration-500 ease-in-out">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          {bestStock.symbol}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {bestStock.name || "Featured Company"}
        </p>

        <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
          ₹{bestStock.price?.toFixed(2)}
        </div>

        <div className={`text-sm font-semibold ${changeColor}`}>
          {bestStock.change_percent > 0
            ? `+${bestStock.change_percent.toFixed(2)}%`
            : `${bestStock.change_percent.toFixed(2)}%`}
        </div>

        <div
          className={`mt-4 inline-flex px-4 py-1.5 rounded-full text-xs font-medium ${statusColor}`}>
          {bestStock.status}
        </div>
      </div>
    </div>
  );
}
