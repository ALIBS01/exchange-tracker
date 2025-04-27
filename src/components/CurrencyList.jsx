import useFetchData from "../hooks/useFetchData";

const CurrencyList = ({ onCurrencySelect }) => {
  const { data, loading, error } = useFetchData("/exchange_rates");

  if (loading) return <p className="p-4">Loading fiat currencies...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading data.</p>;

  const rates = data?.rates || {};
  const fiatCurrencies = Object.entries(rates).filter(([_, rate]) => rate.type === "fiat");

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Fiat Currencies</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Currency</th>
              <th className="p-4 text-right">Unit</th>
              <th className="p-4 text-right">Value (USD)</th>
            </tr>
          </thead>
          <tbody>
            {fiatCurrencies.map(([key, item], index) => (
              <tr
                key={key}
                className="border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => onCurrencySelect(key)}
              >
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{item.name}</td>
                <td className="p-4 text-right">{item.unit}</td>
                <td className="p-4 text-right">{item.value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CurrencyList;
