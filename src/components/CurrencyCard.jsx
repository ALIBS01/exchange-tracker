const CurrencyCard = ({ name, symbol, value, type, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white p-4 rounded-xl shadow hover:shadow-md transition"
    >
      <h3 className="text-md font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{symbol.toUpperCase()}</p>
      <p className="text-lg font-bold">{value.toFixed(4)}</p>
    </div>
  );
};

export default CurrencyCard;
