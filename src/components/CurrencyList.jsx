import useFetchData from "../hooks/useFetchData";
import CurrencyCard from "./CurrencyCard";

const CurrencyList = ({ onCurrencySelect }) => {
  const { data, loading, error } = useFetchData("/exchange_rates");

  if (loading) return <p className="p-4">Loading fiat currencies...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading data.</p>;

  const rates = data?.rates || {};
  const fiatCurrencies = Object.entries(rates).filter(([_, rate]) => rate.type === "fiat");

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Fiat Currencies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {fiatCurrencies.map(([key, item]) => (
          <div
            key={key}
            onClick={() => onCurrencySelect(key)}
            className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer text-center"
          >
            <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.unit}</p>
            <p className="mt-2 text-blue-600 font-bold">{item.value.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CurrencyList;
