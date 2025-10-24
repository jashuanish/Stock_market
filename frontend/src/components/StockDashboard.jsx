import React, { useEffect, useState } from "react";

export default function StockDashboard() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/stocks")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stock data");
        return res.json();
      })
      .then((data) => {
        setStocks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-gray-500">⏳ Loading...</div>;
  if (error) return <div className="text-center text-red-500">❌ {error}</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Smart Stock Tracker</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stocks.map((stock, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">{stock.symbol}</h2>
            <p>💰 Price: ${stock.current_price}</p>
            <p>📈 Change: {stock.change_percent}%</p>
            <p>📊 Volume: {stock.volume}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
