import { useParams } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import useFetchData from "../hooks/useFetchData";

const DerivativeDetail = () => {
  const { id } = useParams();

  const { data: derivativeExchange, loading, error } = useFetchData(
    `/derivatives/exchanges/${id}?include_tickers=all`
  );
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("openInterest");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredAndSortedTickers = useMemo(() => {
    if (loading || error || !derivativeExchange || !derivativeExchange.tickers) {
      return [];
    }

    let sortableTickers = [...derivativeExchange.tickers];

    if (searchTerm) {
      sortableTickers = sortableTickers.filter(
        (ticker) =>
          ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (ticker.base && ticker.base.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (ticker.target && ticker.target.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (sortBy) {
      sortableTickers.sort((a, b) => {
        let valA, valB;

        switch (sortBy) {
          case "pair":
            valA = a.symbol?.toLowerCase() || "";
            valB = b.symbol?.toLowerCase() || "";
            break;
          case "price":
            valA = a.last ?? -Infinity;
            valB = b.last ?? -Infinity;
            break;
          case "volume":
            valA = a.converted_volume?.usd ?? -Infinity;
            valB = b.converted_volume?.usd ?? -Infinity;
            break;
          case "openInterest":
            valA = a.open_interest_usd ?? -Infinity;
            valB = b.open_interest_usd ?? -Infinity;
            break;
          case "contractType":
            valA = a.contract_type?.toLowerCase() || "";
            valB = b.contract_type?.toLowerCase() || "";
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
  }, [derivativeExchange, loading, error, searchTerm, sortBy, sortOrder]);

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
        <div className="text-xl font-semibold">Loading derivative exchange details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-400">
        <div className="text-xl font-semibold">Error fetching derivative exchange data. Please try again later.</div>
      </div>
    );
  }

  if (!derivativeExchange) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <div className="text-xl font-semibold">No derivative exchange data found for this ID.</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pb-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
          {derivativeExchange.image && (
            <img
              src={derivativeExchange.image}
              alt={derivativeExchange.name}
              className="w-20 h-20 object-contain rounded-full shadow-md border-2 border-gray-200 dark:border-gray-700"
            />
          )}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3 leading-tight">
              {derivativeExchange.name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-8 gap-y-3 text-gray-600 dark:text-gray-300 text-lg font-medium">
              {derivativeExchange.country && (
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {derivativeExchange.country}
                </p>
              )}
              {derivativeExchange.year_established && (
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Est. {derivativeExchange.year_established}
                </p>
              )}
              {derivativeExchange.url && (
                <a
                  href={derivativeExchange.url}
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
          {(derivativeExchange.trust_score !== undefined) && (
            <div className="bg-gray-700 dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center border border-gray-600 dark:border-gray-700">
              <p className="text-base font-semibold text-gray-300 dark:text-gray-400 mb-2">Trust Score</p>
              <p className="text-4xl font-bold text-indigo-400 dark:text-white leading-none">
                {derivativeExchange.trust_score}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">out of 10</p>
            </div>
          )}
          {(derivativeExchange.trade_volume_24h_btc && parseFloat(derivativeExchange.trade_volume_24h_btc) > 0) ? (
            <div className="bg-gray-700 dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center border border-gray-600 dark:border-gray-700">
              <p className="text-base font-semibold text-gray-300 dark:text-gray-400 mb-2">24h BTC Volume</p>
              <p className="text-4xl font-bold text-green-400 dark:text-white leading-none">
                {parseFloat(derivativeExchange.trade_volume_24h_btc).toLocaleString(undefined, { maximumFractionDigits: 0 })}
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

          {(derivativeExchange.number_of_perpetual_pairs !== undefined && derivativeExchange.number_of_perpetual_pairs > 0) ? (
            <div className="bg-gray-700 dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center border border-gray-600 dark:border-gray-700">
              <p className="text-base font-semibold text-gray-300 dark:text-gray-400 mb-2">Perpetual Pairs</p>
              <p className="text-4xl font-bold text-purple-400 dark:text-white leading-none">
                {derivativeExchange.number_of_perpetual_pairs.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">available</p>
            </div>
          ) : (
            <div className="bg-gray-700 dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center border border-gray-600 dark:border-gray-700">
                <p className="text-base font-semibold text-gray-300 dark:text-gray-400 mb-2">Perpetual Pairs</p>
                <p className="text-4xl font-bold text-gray-400 dark:text-gray-500 leading-none">0</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">available</p>
            </div>
          )}
          {(derivativeExchange.open_interest_btc !== undefined && parseFloat(derivativeExchange.open_interest_btc) > 0) ? (
            <div className="bg-gray-700 dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center border border-gray-600 dark:border-gray-700">
              <p className="text-base font-semibold text-gray-300 dark:text-gray-400 mb-2">Open Interest (BTC)</p>
              <p className="text-4xl font-bold text-indigo-400 dark:text-white leading-none">
                {parseFloat(derivativeExchange.open_interest_btc).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">BTC</p>
            </div>
          ) : (
            <div className="bg-gray-700 dark:bg-gray-900 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center justify-center border border-gray-600 dark:border-gray-700">
                <p className="text-base font-semibold text-gray-300 dark:text-gray-400 mb-2">Open Interest (BTC)</p>
                <p className="text-4xl font-bold text-gray-400 dark:text-gray-500 leading-none">0</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">BTC</p>
            </div>
          )}
        </div>
        
        {derivativeExchange.description && (
          <div className="mb-10 p-8 bg-gray-800 dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-600 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-100 dark:text-white mb-5">About {derivativeExchange.name}</h2>
            <div
              className="prose prose-lg dark:prose-invert max-w-none text-gray-300 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: derivativeExchange.description }}
            ></div>
          </div>
        )}

        <div className="p-8 bg-gray-700 dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-600 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-100 dark:text-white mb-6">Derivatives Markets</h2>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search derivative pairs (e.g., BTC/USD, ETH/USDT)..."
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
                    Price (USD) {getSortIcon("price")}
                  </th>
                  <th
                    className="px-6 py-4 text-right text-xs font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("volume")}
                  >
                    Volume (24h, USD) {getSortIcon("volume")}
                  </th>
                  <th
                    className="px-6 py-4 text-right text-xs font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("openInterest")}
                  >
                    Open Interest (USD) {getSortIcon("openInterest")}
                  </th>
                  <th
                    className="pl-8 pr-8 py-4 text-right text-xs font-semibold text-gray-300 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("contractType")}
                  >
                    Contract Type {getSortIcon("contractType")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 dark:bg-gray-900 divide-y divide-gray-700 dark:divide-gray-800">
                {filteredAndSortedTickers.length > 0 ? (
                  filteredAndSortedTickers.map((ticker) => (
                    <tr key={ticker.symbol} className="hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-100 dark:text-gray-200 font-medium text-base">
                        {ticker.symbol?.toUpperCase() || ''}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-100 dark:text-gray-200 text-base font-normal font-sans">
                        {ticker.last !== undefined && ticker.last !== null
                          ? `$${parseFloat(ticker.last).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-100 dark:text-gray-200 text-base font-normal font-sans">
                        {ticker.converted_volume?.usd !== undefined && ticker.converted_volume?.usd !== null
                          ? `$${parseFloat(ticker.converted_volume.usd).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-100 dark:text-gray-200 text-base font-normal font-sans">
                        {ticker.open_interest_usd !== undefined && ticker.open_interest_usd !== null
                          ? `$${parseFloat(ticker.open_interest_usd).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                          : '-'}
                      </td>
                      <td className="pl-8 pr-8 py-4 whitespace-nowrap text-right text-gray-100 dark:text-gray-200 text-base font-normal">
                        {ticker.contract_type ? ticker.contract_type.charAt(0).toUpperCase() + ticker.contract_type.slice(1) : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400 dark:text-gray-400 text-lg">
                      No derivative market data available or matching your search criteria for this exchange.
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

export default DerivativeDetail;