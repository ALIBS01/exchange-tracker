import { useState } from "react";
import { FaCoins, FaDollarSign } from "react-icons/fa";

const CoinConverter = ({ coinSymbol, coinPrice }) => {
  const [coinAmount, setCoinAmount] = useState("");

  const handleCoinChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setCoinAmount(value);
    }
  };

  const currencyAmount = coinAmount ? (coinAmount * coinPrice).toFixed(2) : "";

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-md w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {coinSymbol.toUpperCase()} Converter
      </h3>

      <div className="flex flex-col gap-4">

        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
          <FaCoins className="text-gray-500 mr-3" />
          <input
            type="text"
            placeholder={`Enter ${coinSymbol.toUpperCase()}`}
            value={coinAmount}
            onChange={handleCoinChange}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          <span className="text-sm text-gray-600 font-medium">
            {coinSymbol.toUpperCase()}
          </span>
        </div>


        <div className="flex items-center border border-gray-300 rounded-xl px-4 py-3 bg-gray-50">
          <FaDollarSign className="text-gray-500 mr-3" />
          <input
            type="text"
            value={currencyAmount}
            readOnly
            placeholder="0.00"
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
          <span className="text-sm text-gray-600 font-medium">USD</span>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-3">
        1 {coinSymbol.toUpperCase()} ≈ ${coinPrice.toFixed(4)} USD
      </p>
    </div>
  );
};

export default CoinConverter;
