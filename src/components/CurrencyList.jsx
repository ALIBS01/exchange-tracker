import useFetchData from "../hooks/useFetchData";
import CurrencyCard from "./CurrencyCard";

const CurrencyList = () => {
  const { data, loading, error } = useFetchData("/exchange_rates");

  if (loading) return <p className="text-center">Loading fiat currencies...</p>;
  if (error) return <p className="text-center text-red-500">Error fetching data.</p>;

  const fiatCurrencies = Object.entries(data?.rates || {}).filter(
    ([, item]) => item.type === "fiat"
  );

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
