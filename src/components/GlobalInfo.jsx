import useGlobalData from "../hooks/useGlobalData";

const GlobalInfo = () => {
  const { globalData, loading } = useGlobalData();

  if (loading || !globalData) return null;

  const marketCap = globalData.total_market_cap.usd.toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  });

  const volume = globalData.total_volume.usd.toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  });

  const btcDominance = globalData.market_cap_percentage.btc.toFixed(1);

  return (
    <div className="hidden sm:flex text-sm text-gray-600 gap-4 ml-4">
      <span>🌐 Market Cap: ${marketCap}</span>
      <span>💰 Volume: ${volume}</span>
      <span>⚡ BTC Dominance: {btcDominance}%</span>
    </div>
  );
};

export default GlobalInfo;
