import useFetchData from "../hooks/useFetchData";
import CurrencyCard from "./CurrencyCard";

const CurrencyList = ({ onCurrencySelect }) => {
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
            onClick={() => onCurrencySelect(key)}
          />
        ))}
      </div>
    </section>
  );
};


export default CurrencyList;
