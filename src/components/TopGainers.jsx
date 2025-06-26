import useFetchData from "../hooks/useFetchData";

const TopGainers = () => {
  const { data, loading, error } = useFetchData("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 50,
    price_change_percentage: "24h",
  });

  if (loading) return <div className="p-4">Loading top gainers...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load gainers.</div>;
  if (!data || !Array.isArray(data)) return null;

  const topGainers = data
    .filter((coin) => coin.price_change_percentage_24h_in_currency > 0)
    .sort(
      (a, b) =>
        b.price_change_percentage_24h_in_currency -
        a.price_change_percentage_24h_in_currency
    )
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Top Gainers (24h)
      </h3>
      <ul className="space-y-3">
        {topGainers.map((coin) => (
          <li key={coin.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="w-6 h-6" />
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {coin.name} ({coin.symbol.toUpperCase()})
              </span>
            </div>
            <span className="text-green-600 dark:text-green-400 font-semibold">
              {coin.price_change_percentage_24h_in_currency.toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopGainers;
