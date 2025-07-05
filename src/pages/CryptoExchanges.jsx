import useFetchData from "../hooks/useFetchData";
import { Link } from "react-router-dom";

const CryptoExchanges = () => {
  const { data: exchanges, loading, error } = useFetchData("/exchanges?per_page=100&page=1");

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error fetching exchanges data.</div>;

  return (
    <div className="w-full px-4 py-10 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-200">
        Top Crypto Exchanges Ranked by Trust Score
      </h1>
      <p className="mb-6 dark:text-gray-400">CoinMeta ranks and scores exchanges based on traffic, trust score, trading volumes.</p>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Exchange</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Trust Score</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">24h Volume (BTC)</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {exchanges?.map((exchange, index) => (
              <tr key={exchange.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                  {index + 1}
                </td>
                <td className="px-6 py-4 flex items-center gap-3 text-gray-800 dark:text-gray-200">
                  <img src={exchange.image} alt={exchange.name} className="w-8 h-8 rounded-full" />
                  <Link
                    to={`/exchange/${exchange.id}`}
                    className="hover:underline text-blue-600 dark:text-blue-400"
                  >
                    {exchange.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-md font-semibold
                      ${exchange.trust_score >= 8 ? 'bg-green-900 text-green-400' :
                        exchange.trust_score >= 5 ? 'bg-yellow-900 text-yellow-400' :
                        'bg-red-900 text-red-400'}
                    `}
                  >
                    {exchange.trust_score}/10
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-gray-800 dark:text-gray-200">
                  {parseFloat(exchange.trade_volume_24h_btc).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoExchanges;
