import useFetchData from "../hooks/useFetchData";
import { Link } from "react-router-dom";

const Derivatives = () => {
  const { data: derivativesExchanges, loading, error } = useFetchData("/derivatives/exchanges?per_page=100&page=1");

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error fetching derivatives exchanges data.</div>;

  return (
    <div className="w-full px-4 py-10 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-200">
        Top Derivative Exchanges
      </h1>
      <p className="mb-6 dark:text-gray-400">
        Explore leading cryptocurrency derivative exchanges by 24-hour trading volume and open interest.
      </p>
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Exchange</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">24h Volume (BTC)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">24h Open Interest (BTC)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Perpetual Pairs</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Futures Pairs</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {derivativesExchanges?.map((exchange, index) => (
              <tr key={exchange.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{index + 1}</td>
                <td className="px-6 py-4 flex items-center gap-3 text-gray-800 dark:text-gray-200">
                  <img src={exchange.image} alt={exchange.name} className="w-8 h-8 rounded-full" />
                  <Link
                    to={`/derivatives/${exchange.id}`}
                    className="hover:underline text-blue-600 dark:text-blue-400"
                  >
                    {exchange.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-right text-gray-800 dark:text-gray-200">
                  {exchange.trade_volume_24h_btc ? parseFloat(exchange.trade_volume_24h_btc).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'} BTC
                </td>
                <td className="px-6 py-4 text-right text-gray-800 dark:text-gray-200">
                  {exchange.open_interest_btc ? parseFloat(exchange.open_interest_btc).toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'} BTC
                </td>
                <td className="px-6 py-4 text-right text-gray-800 dark:text-gray-200">
                  {exchange.number_of_perpetual_pairs || 0}
                </td>
                <td className="px-6 py-4 text-right text-gray-800 dark:text-gray-200">
                  {exchange.number_of_futures_pairs || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Derivatives;