const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-2xl shadow p-4">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-lg font-semibold text-gray-800">{value}</p>
  </div>
);

const CoinStats = ({ market, symbol, genesis_date, market_cap_rank, hashing_algorithm, public_interest_score }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard label="Market Cap" value={`$${market.market_cap.usd.toLocaleString()}`} />
      <StatCard label="24h Volume" value={`$${market.total_volume.usd.toLocaleString()}`} />
      <StatCard label="Circulating Supply" value={`${market.circulating_supply?.toLocaleString()} ${symbol.toUpperCase()}`} />
      {market.total_supply && (
        <StatCard label="Total Supply" value={`${market.total_supply.toLocaleString()} ${symbol.toUpperCase()}`} />
      )}
      <StatCard label="All Time High" value={`$${market.ath.usd.toLocaleString()} on ${market.ath_date.usd.slice(0, 10)}`} />
      {genesis_date && <StatCard label="Genesis Date" value={genesis_date} />}
      <StatCard label="Market Cap Rank" value={market_cap_rank || "N/A"} />
    </div>
  );
};

export default CoinStats;
