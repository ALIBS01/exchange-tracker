import { useNavigate } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useState } from "react";
import FilterTabs from "./FilterTabs";

const CryptoList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const perPage = 50;
  const totalPages = 20;

  const filterParams = {
    all: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: perPage,
      page: page,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    },
    trending: {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: perPage,
      page: page,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    },
    new: {
      vs_currency: "usd",
      order: "market_cap_asc",
      per_page: perPage,
      page: page,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    },
    gainers: {
      vs_currency: "usd",
      order: "price_change_percentage_24h_desc",
      per_page: perPage,
      page: page,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    },
    most_visited: {
      vs_currency: "usd",
      order: "volume_desc",
      per_page: perPage,
      page: page,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    },
  };

  const { data, loading, error } = useFetchData("/coins/markets", filterParams[selectedFilter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    setPage(1);
  };

  if (loading) return <p className="p-4">Loading cryptocurrencies...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading data.</p>;

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Cryptocurrencies</h2>
      <FilterTabs selected={selectedFilter} onSelect={handleFilterChange} />

      <div className="overflow-x-auto mt-4">
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
            {Array.isArray(data) &&
              data.map((coin, index) => (
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
                  <td className="p-4 text-right">
                    {coin.current_price !== undefined ? `$${coin.current_price.toLocaleString()}` : "N/A"}
                  </td>
                  <td className={`p-4 text-right ${coin.price_change_percentage_1h_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                    {coin.price_change_percentage_1h_in_currency?.toFixed(2) ?? "N/A"}%
                  </td>
                  <td className={`p-4 text-right ${coin.price_change_percentage_24h_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                    {coin.price_change_percentage_24h_in_currency?.toFixed(2) ?? "N/A"}%
                  </td>
                  <td className={`p-4 text-right ${coin.price_change_percentage_7d_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                    {coin.price_change_percentage_7d_in_currency?.toFixed(2) ?? "N/A"}%
                  </td>
                  <td className="p-4 text-right">
                    {coin.market_cap !== undefined ? `$${coin.market_cap.toLocaleString()}` : "N/A"}
                  </td>
                  <td className="p-4 text-right">
                    {coin.total_volume !== undefined ? `$${coin.total_volume.toLocaleString()}` : "N/A"}
                  </td>
                  <td className="p-4 text-right">
                    {coin.circulating_supply !== undefined
                      ? `${coin.circulating_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`
                      : "N/A"}
                  </td>
                  <td className="p-4 text-right w-[150px] h-[50px]">
                    {coin.sparkline_in_7d?.price ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={coin.sparkline_in_7d.price.map((p, idx) => ({ value: p, time: idx }))}
                        >
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            dot={false}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-8">
        <ul className="flex gap-2 text-black font-semibold items-center">
          <li>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${
                page === 1 ? "text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              &lt;
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p <= 5 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce((acc, p, i, arr) => {
              if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === "..." ? (
                <li key={idx} className="px-3 py-1 text-gray-400 select-none">
                  ...
                </li>
              ) : (
                <li key={p}>
                  <button
                    onClick={() => handlePageChange(p)}
                    className={`px-3 py-1 rounded cursor-pointer hover:bg-gray-200 ${
                      p === page ? "bg-gray-300" : ""
                    }`}
                  >
                    {p}
                  </button>
                </li>
              )
            )}

          <li>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${
                page === totalPages ? "text-gray-400 cursor-not-allowed" : ""
              }`}
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
