import { useEffect, useState } from "react";
import axios from "axios";

const TrendingList = ({ onCoinSelect }) => {
  const [trendingCoins, setTrendingCoins] = useState([]);
  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = "https://api.coingecko.com/api/v3";

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/search/trending`, {
          params: {
            x_cg_demo_api_key: API_KEY,
          },
        });

        setTrendingCoins(res.data.coins || []);
      } catch (err) {
        console.error("Trending fetch error", err);
      }
    };

    fetchTrending();
  }, []);

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🔥 Trending Coins</h2>
      <div className="flex overflow-x-auto space-x-4 pb-2">
        {trendingCoins.map(({ item }) => (
          <div
            key={item.id}
            onClick={() => onCoinSelect(item.id)}
            className="min-w-[150px] bg-white p-4 rounded-2xl shadow hover:scale-105 transition cursor-pointer"
          >
            <img
              src={item.small}
              alt={item.name}
              className="w-12 h-12 mx-auto mb-2"
            />
            <h3 className="text-center font-semibold text-sm">{item.name}</h3>
            <p className="text-center text-gray-500 text-xs">{item.symbol.toUpperCase()}</p>
            <p className="text-center text-green-500 text-xs mt-1">
              Rank #{item.market_cap_rank}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingList;
