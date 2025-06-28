import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

const AthLosses = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const perPage = 50;
  const totalPages = 2;

  const { data, loading, error } = useFetchData("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: perPage,
    page,
    sparkline: true,
    price_change_percentage: "1h,24h,7d",
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <section className="p-4 w-full">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Price Change Since ATH (%)
      </h2>

      {loading ? (
        <p>Loading coins...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load data.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-2xl shadow">
              <thead className="bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">#</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Coin</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">ATH Change</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Market cap</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Volume (24h)</th>
                  <th className="p-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Last 7 days</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((coin, index) => (
                  <tr
                    key={coin.id}
                    onClick={() => navigate(`/coin/${coin.id}`)}
                    className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="p-4">{(page - 1) * perPage + index + 1}</td>
                    <td className="p-4 flex items-center gap-2">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                      <div>
                        <div className="font-semibold text-gray-800 dark:text-white">{coin.name}</div>
                        <div className="text-xs text-gray-500 uppercase">{coin.symbol}</div>
                      </div>
                    </td>
                    <td className="p-4 text-right text-gray-800 dark:text-gray-200">
                      ${coin.current_price?.toLocaleString()}
                    </td>
                    <td className={`p-4 text-right ${coin.ath_change_percentage > 0 ? "text-green-500" : "text-red-500"}`}>
                      {coin.ath_change_percentage?.toFixed(2)}%
                    </td>
                    <td className="p-4 text-right text-gray-600 dark:text-gray-300">
                      ${coin.market_cap?.toLocaleString()}
                    </td>
                    <td className="p-4 text-right text-gray-600 dark:text-gray-300">
                      ${coin.total_volume?.toLocaleString()}
                    </td>
                    <td className="p-4 text-right w-[150px] h-[50px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={coin.sparkline_in_7d?.price?.map((p, idx) => ({
                            value: p,
                            time: idx,
                          })) || []}
                          margin={{ top: 5, bottom: 5, left: 0, right: 0 }}
                        >
                          <YAxis domain={['dataMin', 'dataMax']} hide />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            dot={false}
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-8">
            <ul className="flex gap-2 text-black dark:text-white font-semibold items-center">
              <li>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    page === 1 ? "text-gray-400 cursor-not-allowed" : ""
                  }`}
                >
                  &lt;
                </button>
              </li>

              {[...Array(totalPages).keys()].map((i) => (
                <li key={i + 1}>
                  <button
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${
                      page === i + 1 ? "bg-gray-300 dark:bg-gray-600" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    page === totalPages ? "text-gray-400 cursor-not-allowed" : ""
                  }`}
                >
                  &gt;
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </section>
  );
};

export default AthLosses;
