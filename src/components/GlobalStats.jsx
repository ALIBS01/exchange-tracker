import useFetchData from "../hooks/useFetchData";

const GlobalStats = () => {
    const { data, loading, error } = useFetchData("/global");

    if (loading) return <div className="text-sm text-gray-500">Loading global stats...</div>;
    if (error) return <div className="text-sm text-red-500">Error: {error.message}</div>;

    const stats = data?.data;
    if (!stats) return null;
    console.log("FULL STATS:", stats);

    return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-800 px-2 py-1 bg-white">
            <Stat label="Cryptos" value={formatNumber(stats.active_cryptocurrencies)} />
            <Stat label="Exchanges" value={formatNumber(stats.markets)} />
            <Stat
                label="Market Cap"
                value={`$${formatCompact(stats.total_market_cap.usd)}`}
                percentage={stats.market_cap_change_percentage_24h_usd}
            />
            <Stat
                label="24h Vol"
                value={`$${formatCompact(stats.total_volume.usd)}`}
                percentage={(stats.total_volume.usd / stats.total_market_cap.usd) * 100}
            />
            <Stat
                label="Dominance"
                value={`BTC: ${stats.market_cap_percentage.btc.toFixed(1)}% ETH: ${stats.market_cap_percentage.eth.toFixed(1)}%`}
            />
        </div>
    );
};

const Stat = ({ label, value, percentage }) => (
    <div className="flex items-center gap-1 whitespace-nowrap">
        <span className="text-gray-500">{label}:</span>
        <span className="font-medium text-gray-900">{value}</span>
        {percentage !== undefined && (
            <span className={`ml-1 flex items-center text-xs font-medium ${percentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                {percentage >= 0 ? <UpArrowIcon /> : <DownArrowIcon />}
                {Math.abs(percentage).toFixed(2)}%
            </span>
        )}
    </div>
);

const UpArrowIcon = () => (
    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 10l5-5 5 5H5z" />
    </svg>
);

const DownArrowIcon = () => (
    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 10l5 5 5-5H5z" />
    </svg>
);

const formatNumber = (num) => {
    return Number(num).toLocaleString("de-DE");
};

const formatCompact = (num) => {
    const formatter = new Intl.NumberFormat("en", {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: 2,
    });
    return formatter.format(num);
};

export default GlobalStats;
