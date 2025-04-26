import useFetchData from "../hooks/useFetchData";
import CurrencyCard from "./CurrencyCard";

const CurrencyList = () => {
  const { data, loading, error } = useFetchData("/exchange_rates");

  if (loading) return <p className="p-4">Loading fiat currencies...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading data.</p>;

  const rates = data?.rates || {};
  const fiatCurrencies = Object.entries(rates).filter(([_, rate]) => rate.type === "fiat");

  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Fiat Currencies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {fiatCurrencies.map(([key, item]) => (
          <CurrencyCard
            key={key}
            name={item.name}
            symbol={item.unit}
            value={item.value}
            type={item.type}
          />
        ))}
      </div>
    </section>
  );
};

export default CurrencyList;
