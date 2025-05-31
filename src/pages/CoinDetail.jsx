import { useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import CoinChart from "../components/CoinChart";
import CoinConverter from "../components/CoinConverter";
import CoinStats from "../components/CoinStats";
import CoinFAQ from "../components/CoinFAQ";
import SimilarCoins from "../components/SimilarCoins";

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
    market_cap_rank,
    hashing_algorithm,
    links,
    public_interest_score,
    categories,
  } = data;

  return (
    <div className="mt-10 px-6 py-10 max-w-7xl mx-auto rounded-2xl">

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

      <div className="grid md:grid-cols-3 gap-6 mt-10 text-sm text-gray-700">
        <div className="md:col-span-2">
          <CoinStats
            market={market}
            symbol={symbol}
            genesis_date={genesis_date}
            rank={market_cap_rank}
            hashing_algorithm={hashing_algorithm}
            interest={public_interest_score}
          />

          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About {name}</h2>
            <div
              className="text-gray-700 leading-relaxed text-base"
              dangerouslySetInnerHTML={{
                __html: description.en || "No description available.",
              }}
            />
            {(links.homepage[0] && links.homepage[0] !== "") && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Resources</h3>
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
                  <a
                    href={links.homepage[0]}
                    className="text-blue-600 hover:underline break-words"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {links.homepage[0]}
                  </a>
                </div>
              </div>
            )}
          </div>

          <CoinFAQ coinName={name} />
        </div>

        <div>
          <CoinConverter coinSymbol={symbol} coinPrice={market.current_price.usd} />
        </div>
      </div>


      {categories && categories.length > 0 && (
        <SimilarCoins category={categories[0]} currentCoinId={id} />
      )}
    </div>
  );
};

export default CoinDetail;
