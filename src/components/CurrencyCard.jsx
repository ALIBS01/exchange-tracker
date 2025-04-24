const CurrencyCard = ({ name, symbol, value, type }) => {
    return (
      <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{symbol}</p>
        <p className="text-blue-600 text-xl font-bold">{value.toFixed(2)}</p>
        <p className="text-xs text-gray-400 mt-1">{type}</p>
      </div>
    );
  };
  
  export default CurrencyCard;
  