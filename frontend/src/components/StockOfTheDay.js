import React, { useEffect, useState, useRef } from "react";
import { Star } from "lucide-react";

export default function StockOfTheDay({ best, loading }) {
  const [displayStock, setDisplayStock] = useState(best);
  const prevStockRef = useRef(best);

  useEffect(() => {
    if (!best) return;

    // Update only the changed fields — prevents full re-render
    setDisplayStock((prev) => {
      if (!prev) return best;

      // If all values are same, don't update
      if (JSON.stringify(best) === JSON.stringify(prev)) return prev;

      return {
        ...prev,
        ...best,
      };
    });

    prevStockRef.current = best;
  }, [best]);

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

  const { symbol, name, price, change_percent, status } = displayStock;

  const statusColor =
    status === "Strong Buy"
      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
      : status === "Strong Sell"
      ? "bg-red-500/10 text-red-500 border border-red-500/20"
      : "bg-slate-500/10 text-slate-500 border border-slate-500/20";

  const changeColor =
    change_percent > 0
      ? "text-emerald-500"
      : change_percent < 0
      ? "text-red-500"
      : "text-slate-400";

  return (
    <div className="rounded-2xl p-5 bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-lg transition-all duration-300 hover:shadow-md flex items-center justify-between gap-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <Star className="text-amber-400 w-6 h-6 drop-shadow-sm" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white tracking-tight">
          Stock of the Day
        </h2>
      </div>

      {/* Symbol and name */}
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white transition-all duration-500">
          {symbol}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{name}</p>
      </div>

      {/* Price + Change */}
      <div className="flex flex-col items-center sm:items-end text-right">
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white transition-all duration-300">
          ₹{price?.toFixed(2)}
        </div>
        <div
          className={`text-sm font-semibold ${changeColor} transition-all duration-300`}>
          {change_percent > 0
            ? `+${change_percent.toFixed(2)}%`
            : `${change_percent.toFixed(2)}%`}
        </div>
      </div>

      {/* Status pill */}
      <div
        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors duration-500 ${statusColor}`}>
        {status}
      </div>
    </div>
  );
}
