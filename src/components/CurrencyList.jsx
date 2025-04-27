import useMarketData from "../hooks/useMarketData";

const CurrencyList = ({ onCurrencySelect }) => {
  const { coins, loading, error } = useMarketData();

  if (loading) return <p className="p-4">Loading market data...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading data.</p>;

  return (
    <section className="p-4 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Market Coins</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">#</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">1h %</th>
              <th className="px-4 py-2 text-left">24h %</th>
              <th className="px-4 py-2 text-left">7d %</th>
              <th className="px-4 py-2 text-left">Market Cap</th>
              <th className="px-4 py-2 text-left">Volume(24h)</th>
              <th className="px-4 py-2 text-left">Circulating Supply</th>
              <th className="px-4 py-2 text-left">Last 7 Days</th>
            </tr>
          </thead>

          <tbody>
            {coins.map((coin, index) => (
              <tr
                key={coin.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onCurrencySelect(coin.id)}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6" />
                  {coin.name}
                </td>
                <td className="px-4 py-2">${coin.current_price.toFixed(2)}</td>
                <td className={`px-4 py-2 ${coin.price_change_percentage_1h_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
                </td>
                <td className={`px-4 py-2 ${coin.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </td>
                <td className={`px-4 py-2 ${coin.price_change_percentage_7d_in_currency > 0 ? "text-green-500" : "text-red-500"}`}>
                  {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
                </td>
                <td className="px-4 py-2">${coin.market_cap.toLocaleString()}</td>
                <td className="px-4 py-2">${coin.total_volume.toLocaleString()}</td>
                <td className="px-4 py-2">{coin.circulating_supply?.toLocaleString()}</td>
                <td className="px-4 py-2">Graph</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CurrencyList;
