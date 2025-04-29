import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CoinDetail = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false,
            x_cg_demo_api_key: API_KEY,
          },
        });
        setCoin(res.data);
      } catch (err) {
        console.error("Error fetching coin data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [id]);

  if (loading) return <p className="p-4">Loading coin details...</p>;
  if (!coin) return <p className="p-4 text-red-500">Coin not found.</p>;

  const {
    image,
    name,
    symbol,
    market_cap_rank,
    market_data,
    description,
    links,
  } = coin;

  return (
    <div className="p-6 max-w-5xl mx-auto">
        
      <div className="flex items-center gap-4 mb-6">
        <img src={image.large} alt={name} className="w-12 h-12" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {name} ({symbol.toUpperCase()})
          </h1>
          <p className="text-gray-500">Rank #{market_cap_rank}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-2xl shadow p-6 mb-8">
        <div>
          <p className="text-gray-500 text-sm">Current Price</p>
          <p className="text-2xl font-bold text-gray-800">${market_data.current_price.usd.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">24h Change</p>
          <p className={`font-semibold ${market_data.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"}`}>
            {market_data.price_change_percentage_24h.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Market Cap</p>
          <p className="font-semibold text-gray-800">${market_data.market_cap.usd.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-2xl shadow p-6 mb-8">
        <div>
          <p className="text-gray-500 text-sm">Circulating Supply</p>
          <p className="font-medium text-gray-800">
            {market_data.circulating_supply.toLocaleString()} {symbol.toUpperCase()}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Supply</p>
          <p className="text-gray-800">
            {market_data.total_supply ? market_data.total_supply.toLocaleString() : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">All-Time High</p>
          <p className="text-gray-800">${market_data.ath.usd.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">About {name}</h2>
        <div
          className="prose max-w-none text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: description.en || "No description available." }}
        />
        {links.homepage[0] && (
          <a
            href={links.homepage[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-600 hover:underline text-sm"
          >
            Visit Official Website →
          </a>
        )}
      </div>
    </div>
  );
};

export default CoinDetail;
