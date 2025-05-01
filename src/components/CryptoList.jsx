import { useNavigate } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useState } from "react";

const CryptoList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const perPage = 50;
  const totalPages = 20;

  const { data, loading, error } = useFetchData("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: perPage,
    page: page,
    sparkline: true,
    price_change_percentage: "1h,24h,7d",
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <p className="p-4">Loading cryptocurrencies...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading data.</p>;

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Cryptocurrencies</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-right">Price</th>
              <th className="p-4 text-right">1h %</th>
              <th className="p-4 text-right">24h %</th>
              <th className="p-4 text-right">7d %</th>
              <th className="p-4 text-right">Market Cap</th>
              <th className="p-4 text-right">Volume (24h)</th>
              <th className="p-4 text-right">Circulating Supply</th>
              <th className="p-4 text-right">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {data.map((coin, index) => (
              <tr
                key={coin.id}
                className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/coin/${coin.id}`)}
              >
                <td className="p-4">{(page - 1) * perPage + index + 1}</td>
                <td className="p-4 flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">{coin.name}</div>
                    <div className="text-xs text-gray-500 uppercase">{coin.symbol}</div>
                  </div>
                </td>
                <td className="p-4 text-right">${coin.current_price.toLocaleString()}</td>
                <td className={`p-4 text-right ${coin.price_change_percentage_1h_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                </td>
                <td className={`p-4 text-right ${coin.price_change_percentage_24h_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
                </td>
                <td className={`p-4 text-right ${coin.price_change_percentage_7d_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                </td>
                <td className="p-4 text-right">${coin.market_cap.toLocaleString()}</td>
                <td className="p-4 text-right">${coin.total_volume.toLocaleString()}</td>
                <td className="p-4 text-right">
                  {coin.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
                </td>
                <td className="p-4 text-right w-[150px] h-[50px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={coin.sparkline_in_7d.price.map((p, idx) => ({ value: p, time: idx }))}>
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <ul className="flex items-center space-x-2 text-black">
          <li>
            <button
              className="px-2 py-1 rounded hover:bg-gray-700"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              &lt;
            </button>
          </li>
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              Math.abs(pageNum - page) <= 1
            ) {
              return (
                <li key={pageNum}>
                  <button
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded ${
                      page === pageNum
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                </li>
              );
            } else if (
              (pageNum === page - 2 && page > 4) ||
              (pageNum === page + 2 && page < totalPages - 3)
            ) {
              return (
                <li key={pageNum}>
                  <span className="px-2 py-1">...</span>
                </li>
              );
            }
            return null;
          })}
          <li>
            <button
              className="px-2 py-1 rounded hover:bg-gray-700"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              &gt;
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default CryptoList;
