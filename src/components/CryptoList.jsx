import useFetchData from "../hooks/useFetchData";
import CurrencyCard from "./CurrencyCard";

const CryptoList = ({ onCurrencySelect }) => {
  const { data, loading, error } = useFetchData("/coins/markets", { vs_currency: "usd" });

  if (loading) return <p className="p-4">Loading cryptocurrencies...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading data.</p>;

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Cryptocurrencies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {data.map((coin) => (
          <CurrencyCard
            key={coin.id}
            name={coin.name}
            symbol={coin.symbol.toUpperCase()}
            value={coin.current_price}
            type="crypto"
            onClick={() => onCurrencySelect(coin.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default CryptoList;
