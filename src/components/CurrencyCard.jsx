const CurrencyCard = ({ name, symbol, value, type, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-4 bg-white rounded-2xl shadow hover:shadow-lg transition duration-200 flex flex-col items-center"
    >
      <div className="text-xl font-bold text-gray-700">{symbol}</div>
      <div className="text-sm text-gray-500 mb-1">{name}</div>
      <div className="text-md text-gray-800 font-semibold">
        {type === "crypto" ? `$${value}` : value.toFixed(2)}
      </div>
    </div>
  );
};

export default CurrencyCard;
