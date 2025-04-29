import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CoinDetail = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = "https://api.coingecko.com/api/v3";

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/coins/${id}`, {
          params: {
            x_cg_demo_api_key: API_KEY,
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false,
          },
        });
        setCoin(res.data);
      } catch (err) {
        setError("Failed to fetch coin data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <img src={coin.image.large} alt={coin.name} className="w-12 h-12" />
        <h1 className="text-2xl font-bold text-gray-800">{coin.name} ({coin.symbol.toUpperCase()})</h1>
        <span className="text-sm text-gray-500">Rank #{coin.market_cap_rank}</span>
      </div>
      <p className="mb-4 text-gray-700" dangerouslySetInnerHTML={{ __html: coin.description.en?.split(". ")[0] + "." }} />
      <div className="grid grid-cols-2 gap-4 bg-white rounded-xl shadow p-4">
        <div>
          <h2 className="text-gray-600 text-sm">Current Price</h2>
          <p className="text-xl font-semibold text-gray-900">${coin.market_data.current_price.usd}</p>
        </div>
        <div>
          <h2 className="text-gray-600 text-sm">Market Cap</h2>
          <p className="text-lg text-gray-900">${coin.market_data.market_cap.usd.toLocaleString()}</p>
        </div>
        <div>
          <h2 className="text-gray-600 text-sm">24h Change</h2>
          <p className="text-lg text-gray-900">{coin.market_data.price_change_percentage_24h.toFixed(2)}%</p>
        </div>
        <div>
          <h2 className="text-gray-600 text-sm">Circulating Supply</h2>
          <p className="text-lg text-gray-900">{coin.market_data.circulating_supply.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
