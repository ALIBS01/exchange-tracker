import { useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import CoinChart from "../components/CoinChart";

const CoinDetail = () => {
  const { id } = useParams();

  const { data, loading, error } = useFetchData(`/coins/${id}`, {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: false,
  });

  if (loading) return <p className="p-6">Loading coin details...</p>;
  if (error || !data) return <p className="p-6 text-red-500">Error loading coin data.</p>;

  const {
    name,
    symbol,
    image,
    market_data: market,
    description,
    genesis_date,
  } = data;

  return (
    <div className="mt-6 px-6 py-10 max-w-5xl mx-auto bg-white rounded-2xl shadow">
      <div className="flex items-center gap-4 mb-6">
        <img src={image.large} alt={name} className="w-12 h-12" />
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="uppercase text-gray-500">{symbol}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-3xl font-bold text-gray-800">
          ${market.current_price.usd.toLocaleString()}
        </p>
        <div className="flex gap-4 mt-2 text-sm">
          <span className={`font-semibold ${market.price_change_percentage_1h_in_currency.usd > 0 ? "text-green-500" : "text-red-500"}`}>
            1h: {market.price_change_percentage_1h_in_currency.usd?.toFixed(2)}%
          </span>
          <span className={`font-semibold ${market.price_change_percentage_24h_in_currency.usd > 0 ? "text-green-500" : "text-red-500"}`}>
            24h: {market.price_change_percentage_24h_in_currency.usd?.toFixed(2)}%
          </span>
          <span className={`font-semibold ${market.price_change_percentage_7d_in_currency.usd > 0 ? "text-green-500" : "text-red-500"}`}>
            7d: {market.price_change_percentage_7d_in_currency.usd?.toFixed(2)}%
          </span>
        </div>
      </div>

      <CoinChart coinId={id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-gray-700 text-sm">
        <div>
          <p><strong>Market Cap:</strong> ${market.market_cap.usd.toLocaleString()}</p>
          <p><strong>24h Volume:</strong> ${market.total_volume.usd.toLocaleString()}</p>
          <p><strong>Circulating Supply:</strong> {market.circulating_supply?.toLocaleString()} {symbol.toUpperCase()}</p>
          {market.total_supply && (
            <p><strong>Total Supply:</strong> {market.total_supply.toLocaleString()} {symbol.toUpperCase()}</p>
          )}
          <p><strong>All Time High:</strong> ${market.ath.usd.toLocaleString()} on {market.ath_date.usd.slice(0, 10)}</p>
          {genesis_date && <p><strong>Genesis Date:</strong> {genesis_date}</p>}
        </div>
        <div>
          <p className="mb-2 font-semibold">About {name}:</p>
          <div
            className="text-gray-600 text-sm leading-relaxed line-clamp-6"
            dangerouslySetInnerHTML={{
              __html: description.en || "No description available.",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
