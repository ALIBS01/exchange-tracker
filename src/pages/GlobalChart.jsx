import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import useFetchData from "../hooks/useFetchData";

function GlobalChart() {
  const [days, setDays] = useState(30);

  const { data: btcChartData, loading: btcChartLoading, error: btcChartError } = useFetchData(
    `coins/bitcoin/market_chart`, { days: days, vs_currency: 'usd' }
  );

  const { data: ethChartData, loading: ethChartLoading, error: ethChartError } = useFetchData(
    `coins/ethereum/market_chart`, { days: days, vs_currency: 'usd' }
  );

  const { data: globalMetricsData, loading: globalMetricsLoading, error: globalMetricsError } = useFetchData(
    `global`
  );

  const { data: topCoinsData, loading: topCoinsLoading, error: topCoinsError } = useFetchData(
    `coins/markets`, { vs_currency: 'usd', order: 'market_cap_desc', per_page: 10, page: 1, sparkline: false }
  );

  const isLoading = btcChartLoading || ethChartLoading || globalMetricsLoading || topCoinsLoading;
  const hasError = btcChartError || ethChartError || globalMetricsError || topCoinsError;

  const processedCombinedChartData = [];
  if (btcChartData?.market_caps && ethChartData?.market_caps) {
    for (let i = 0; i < btcChartData.market_caps.length; i++) {
      processedCombinedChartData.push({
        date: new Date(btcChartData.market_caps[i][0]).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        btcMarketCap: btcChartData.market_caps[i][1],
        ethMarketCap: ethChartData.market_caps[i]?.[1] || 0,
        btcVolume: btcChartData.total_volumes[i]?.[1] || 0,
        ethVolume: ethChartData.total_volumes[i]?.[1] || 0,
      });
    }
  }

  const dominancePieData = globalMetricsData?.data.market_cap_percentage
    ? Object.entries(globalMetricsData.data.market_cap_percentage)
        .filter(([, percentage]) => percentage > 0.5)
        .sort(([, a], [, b]) => b - a)
        .map(([currency, percentage]) => ({
          name: currency.toUpperCase(),
          value: percentage,
        }))
    : [];

  const PIE_COLORS = ['#F7931A', '#8CC640', '#627EEA', '#E2B24A', '#AC8FE4', '#5BC0DE', '#9378C6', '#2EC5BE'];


  const handleDaysChange = (e) => {
    setDays(e.target.value);
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-md shadow-md bg-white text-gray-800 border border-gray-200">
          <p className="text-sm font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-md shadow-md bg-white text-gray-800 border border-gray-200">
          <p className="text-sm font-semibold">{`${payload[0].name} : ${payload[0].value.toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-gray-800">
          Global Crypto Market Overview
        </h1>

        {isLoading && (
          <div className="flex flex-col justify-center items-center h-64 text-blue-500">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
            <p className="ml-4 text-xl mt-6 font-semibold">Loading market data, please wait...</p>
          </div>
        )}

        {hasError && (
          <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md mx-auto max-w-xl mt-12">
            <p className="font-bold text-2xl mb-2">Error Occurred!</p>
            <p className="text-lg">Failed to fetch data. This might be due to API rate limits or an issue with your API key.</p>
            <p className="text-sm mt-2">Please refresh the page or try again later.</p>
          </div>
        )}

        {!isLoading && !hasError && (
          <>
            <div className="mb-8 flex justify-end">
              <label htmlFor="days" className="mr-3 font-semibold text-lg text-gray-600 flex items-center">
                Period:
              </label>
              <select
                id="days"
                value={days}
                onChange={handleDaysChange}
                className="p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer text-base shadow-sm"
              >
                <option value="1">24 Hours</option>
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="365">1 Year</option>
              </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">BTC & ETH Market Capitalization</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={processedCombinedChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fill: '#4A5568', fontSize: 11 }} />
                    <YAxis type="number" domain={['auto', 'auto']} tickFormatter={formatCurrency} stroke="#A0AEC0" tick={{ fill: '#4A5568', fontSize: 11 }} />
                    <Tooltip content={<CustomLineTooltip />} />
                    <Legend wrapperStyle={{ color: '#4A5568' }} />
                    <Line type="monotone" dataKey="btcMarketCap" stroke="#F7931A" name="Bitcoin M.Cap" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="ethMarketCap" stroke="#627EEA" name="Ethereum M.Cap" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Market Cap Dominance</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dominancePieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      dataKey="value"
                      stroke="none"
                    >
                      {dominancePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ color: '#4A5568' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">BTC & ETH 24h Trading Volume</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={processedCombinedChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fill: '#4A5568', fontSize: 11 }} />
                    <YAxis type="number" domain={['auto', 'auto']} tickFormatter={formatCurrency} stroke="#A0AEC0" tick={{ fill: '#4A5568', fontSize: 11 }} />
                    <Tooltip content={<CustomLineTooltip />} />
                    <Legend wrapperStyle={{ color: '#4A5568' }} />
                    <Line type="monotone" dataKey="btcVolume" stroke="#F7931A" name="Bitcoin Volume" dot={false} strokeWidth={2} />
                    <Line type="monotone" dataKey="ethVolume" stroke="#627EEA" name="Ethereum Volume" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Global Market Summary</h2>
                {globalMetricsData && (
                  <div className="space-y-3 text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-800">Active Cryptocurrencies:</span>{' '}
                      {globalMetricsData.data.active_cryptocurrencies?.toLocaleString() || 'N/A'}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Total Market Cap:</span>{' '}
                      {formatCurrency(globalMetricsData.data.total_market_cap?.usd)}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">24h Trading Volume:</span>{' '}
                      {formatCurrency(globalMetricsData.data.total_volume?.usd)}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-800">Markets:</span>{' '}
                      {globalMetricsData.data.markets?.toLocaleString() || 'N/A'}
                    </p>
                    <p className="font-bold mt-6 text-gray-800 text-lg">Dominance Breakdown:</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      {Object.entries(globalMetricsData.data.market_cap_percentage || {}).map(([currency, percentage]) => (
                        <li key={currency} className="text-gray-700">
                          <span className="font-medium text-gray-800">{currency.toUpperCase()}:</span> {percentage.toFixed(2)}%
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>


            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">Top 10 Cryptocurrencies by Market Cap</h2>
              {topCoinsData && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rank
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Coin
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Market Cap
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          24h Volume
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          24h Change
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topCoinsData.map((coin) => (
                        <tr key={coin.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {coin.market_cap_rank}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                            <img src={coin.image} alt={coin.name} className="w-5 h-5 mr-2 rounded-full" />
                            <span className="font-medium">{coin.name}</span> <span className="text-gray-500 ml-1">({coin.symbol.toUpperCase()})</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(coin.current_price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(coin.market_cap)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(coin.total_volume)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${coin.price_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {coin.price_change_percentage_24h.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default GlobalChart;