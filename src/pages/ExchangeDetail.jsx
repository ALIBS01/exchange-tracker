import { useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import useFetchData from "../hooks/useFetchData";

const ExchangeDetail = () => {
  const { id } = useParams();
  const { data: exchange, loading, error } = useFetchData(`/exchanges/${id}`);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredAndSortedTickers = useMemo(() => {
    if (loading || error || !exchange || !exchange.tickers) {
      return [];
    }

    let sortableTickers = [...exchange.tickers];

    if (searchTerm) {
      sortableTickers = sortableTickers.filter(
        (ticker) =>
          ticker.base.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticker.target.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy) {
      sortableTickers.sort((a, b) => {
        let valA, valB;

        switch (sortBy) {
          case "pair":
            valA = `${a.base}/${a.target}`.toLowerCase();
            valB = `${b.base}/${b.target}`.toLowerCase();
            break;
          case "price":
            valA = a.last ?? -Infinity;
            valB = b.last ?? -Infinity;
            break;
          case "volume":
            valA = a.volume ?? -Infinity;
            valB = b.volume ?? -Infinity;
            break;
          default:
            return 0;
        }

        if (typeof valA === "string") {
          return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }
      });
    }
    return sortableTickers;
  }, [exchange, loading, error, searchTerm, sortBy, sortOrder]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortBy === column) {
      return sortOrder === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <div className="text-xl font-semibold">Loading exchange details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-400">
        <div className="text-xl font-semibold">Error fetching exchange data. Please try again later.</div>
      </div>
    );
  }

  if (!exchange) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <div className="text-xl font-semibold">No exchange data found for this ID.</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pb-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
          {exchange.image && (
            <img
              src={exchange.image}
              alt={exchange.name}
              className="w-20 h-20 object-contain rounded-full shadow-md border-2 border-gray-200 dark:border-gray-700"
            />
          )}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
              {exchange.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-8 gap-y-3 text-gray-600 dark:text-gray-300 text-lg font-medium">
              {exchange.country && (
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {exchange.country}
                </p>
              )}
              {exchange.year_established && (
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Est. {exchange.year_established}
                </p>
              )}
              {exchange.url && (
                <a
                  href={exchange.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  Official Website
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {(exchange.trust_score !== undefined) && (
            <div className="bg-gray-700 dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center border border-gray-600 dark:border-gray-700">
              <p className="text-base font-semibold text-gray-300 dark:text-gray-400 mb-2">Trust Score</p>
              <p className="text-4xl font-bold text-indigo-400 dark:text-white leading-none">
                {exchange.trust_score}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">out of 10</p>
            </div>
          )}
          {(exchange.trade_volume_24h_btc && parseFloat(exchange.trade_volume_24h_btc) > 0) ? (
            <div className="bg-gray-700 dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center border border-gray-600 dark:border-gray-700">
              <p className="text-base font-semibold text-gray-300 dark:text-gray-400 mb-2">24h BTC Volume</p>
              <p className="text-4xl font-bold text-green-400 dark:text-white leading-none">
                {parseFloat(exchange.trade_volume_24h_btc).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">BTC</p>
            </div>
          ) : (
            <div className="bg-gray-700 dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center border border-gray-600 dark:border-gray-700">
                <p className="text-base font-semibold text-gray-300 dark:text-gray-400 mb-2">24h BTC Volume</p>
                <p className="text-4xl font-bold text-gray-400 dark:text-gray-500 leading-none">0</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">BTC</p>
            </div>
          )}

          {(exchange.number_of_spot_pairs !== undefined && exchange.number_of_spot_pairs > 0) ? (
            <div className="bg-gray-700 dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center border border-gray-600 dark:border-gray-700">
              <p className="text-base font-semibold text-gray-300 dark:text-gray-400 mb-2">Spot Pairs</p>
              <p className="text-4xl font-bold text-purple-400 dark:text-purple-300 leading-none">
                {exchange.number_of_spot_pairs.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">available</p>
            </div>
          ) : (
            <div className="bg-gray-700 dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center border border-gray-600 dark:border-gray-700">
                <p className="text-base font-semibold text-gray-300 dark:text-gray-400 mb-2">Spot Pairs</p>
                <p className="text-4xl font-bold text-gray-400 dark:text-gray-500 leading-none">0</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">available</p>
            </div>
          )}
        </div>

        {exchange.description && (
          <div className="mb-10 p-8 bg-gray-800 dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-600 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-100 dark:text-white mb-5">About {exchange.name}</h2>
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-gray-300 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: exchange.description }}
            ></div>
          </div>
        )}

        <div className="p-8 bg-gray-700 dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-600 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-100 dark:text-white mb-6">Spot Markets</h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search market pairs (e.g., BTC/USDT)..."
              className="w-full p-4 rounded-lg border border-gray-500 dark:border-gray-600 bg-gray-600 dark:bg-gray-900 text-gray-100 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-600 dark:border-gray-700 shadow-sm">
            <table className="min-w-full divide-y divide-gray-600 dark:divide-gray-700">
              <thead className="bg-gray-700 dark:bg-gray-700">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("pair")}
                  >
                    Pair {getSortIcon("pair")}
                  </th>
                  <th
                    className="px-6 py-4 text-right text-xs font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("price")} 
                  >
                    Price {getSortIcon("price")}
                  </th>
                  <th
                    className="px-6 py-4 text-right text-xs font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("volume")}
                  >
                    Volume (24h) {getSortIcon("volume")}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wider">
                    Trust
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 dark:bg-gray-900 divide-y divide-gray-700 dark:divide-gray-800">
                {filteredAndSortedTickers.length > 0 ? (
                  filteredAndSortedTickers.map((ticker, idx) => (
                    <tr key={ticker.trade_url || idx} className="hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100 dark:text-gray-200 font-medium text-base">
                        {ticker.base?.toUpperCase() || ''}/{ticker.target?.toUpperCase() || ''}
                        {ticker.converted_last && (
                          <span className="ml-3 text-xs text-gray-400 dark:text-gray-400 font-normal">
                            ({Object.entries(ticker.converted_last).map(([currency, value]) => `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency.toUpperCase()}`).join(', ')})
                          </span>
                        )}
                        {ticker.trade_url && (
                            <a href={ticker.trade_url} target="_blank" rel="noopener noreferrer" className="ml-3 text-blue-400 dark:text-blue-400 hover:underline text-xs">
                                Trade
                            </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-100 dark:text-gray-200 text-base font-normal font-sans">
                        {ticker.last !== undefined && ticker.last !== null
                          ? `$${ticker.last.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-100 dark:text-gray-200 text-base font-normal font-sans">
                        {ticker.volume !== undefined && ticker.volume !== null && ticker.volume > 0
                          ? `$${parseFloat(ticker.volume).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                          : '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              ticker.trust_score === "green"
                                ? "bg-green-600 text-green-100 dark:bg-green-700 dark:text-green-100"
                                : ticker.trust_score === "yellow"
                                ? "bg-yellow-600 text-yellow-100 dark:bg-yellow-700 dark:text-yellow-100"
                                : "bg-red-600 text-red-100 dark:bg-red-700 dark:text-red-100"
                            }`}
                        >
                          {ticker.trust_score || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-400 dark:text-gray-400 text-lg">
                      No market data available or matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeDetail;