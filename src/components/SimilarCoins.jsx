import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SimilarCoins = ({ category, currentCoinId }) => {
  const [similar, setSimilar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/markets`,
          {
            params: {
              vs_currency: "usd",
              category: category,
              order: "market_cap_desc",
              per_page: 6,
              page: 1,
              sparkline: false,
            },
          }
        );
        const filtered = res.data.filter((coin) => coin.id !== currentCoinId);
        setSimilar(filtered);
      } catch (err) {
        console.error("Failed to fetch similar coins", err);
      }
    };

    fetchSimilar();
  }, [category, currentCoinId]);

  if (!similar.length) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Similar Coins to <span className="capitalize">{currentCoinId}</span>
      </h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {similar.map((coin) => (
          <div
            key={coin.id}
            onClick={() => navigate(`/coin/${coin.id}`)}
            className="border border-gray-200 rounded-2xl p-4 bg-white hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <img src={coin.image} alt={coin.name} className="w-6 h-6" />
              <div className="font-semibold">{coin.name}</div>
              <span className="text-xs text-gray-400 uppercase">{coin.symbol}</span>
            </div>
            <div className="text-gray-800 font-bold text-lg">${coin.current_price.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarCoins;
