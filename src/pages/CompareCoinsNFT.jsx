import { useState } from "react";
import CoinSelect from "../components/CoinSelect";

const CompareCoinsNFT = () => {
  const [coinA, setCoinA] = useState(null);
  const [coinB, setCoinB] = useState(null);

  const newPrice = coinA && coinB && coinA.circulating_supply && coinB.market_cap
    ? (coinB.market_cap / coinA.circulating_supply).toFixed(2)
    : null;

  const multiplier = coinA && coinB && coinA.market_cap && coinB.market_cap
    ? (coinB.market_cap / coinA.market_cap).toFixed(2)
    : null;

  return (
    <div className="max-w-5xl mx-auto p-8 text-center">
      <h2 className="text-3xl font-bold mb-8">
        Calculate the price of <span className="text-blue-600">A</span> with the market cap of <span className="text-green-600">B</span>
      </h2>

      <div className="flex justify-center items-start gap-6 mb-8 flex-wrap">
        <CoinSelect selectedCoin={coinA} onSelectCoin={setCoinA} placeholder="Select Coin A" />
        <button
          onClick={() => {
            const temp = coinA;
            setCoinA(coinB);
            setCoinB(temp);
          }}
          className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-75 flex items-center justify-center w-12 h-12 cursor-pointer"
        >

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
        <CoinSelect selectedCoin={coinB} onSelectCoin={setCoinB} placeholder="Select Coin B" />
      </div>

      {coinA && coinB && (
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-xl mx-auto">
          <div className="mb-4">
            <img src={coinA.image} alt={coinA.name} className="w-8 inline-block mr-2" />
            {coinA.name} price with the market cap of
            <img src={coinB.image} alt={coinB.name} className="w-8 inline-block mx-2" />
            {coinB.name}
          </div>
          <div className="text-3xl font-bold mb-4">
            {newPrice ? `$${newPrice}` : "Calculating..."}
            {multiplier && <span className="text-red-500"> ({multiplier}x)</span>}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <div>
              {coinA.name} mcap <div>${coinA?.market_cap?.toLocaleString() ?? "0"}</div>
            </div>
            <div>
              {coinB.name} mcap <div>${coinB?.market_cap?.toLocaleString() ?? "0"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareCoinsNFT;
