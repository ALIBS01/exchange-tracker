import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const CoinSelect = ({ selectedCoin, onSelectCoin, placeholder = "Select a coin..." }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const containerRef = useRef();
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCoins = useCallback(async (searchQuery = "") => {
    setLoading(true);
    setError(null);
    try {
      let endpoint;
      if (searchQuery.length > 1) {
        endpoint = `https://api.coingecko.com/api/v3/search?query=${searchQuery}`;
        const res = await axios.get(endpoint);
        setCoins(res.data.coins);
      } else {
        endpoint = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`;
        const res = await axios.get(endpoint);
        setCoins(res.data);
      }
    } catch (err) {
      console.error("Error fetching coins:", err);
      setError("Failed to load coins. Please try again.");
      setCoins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        fetchCoins(query);
      }, 500);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [open, query, fetchCoins]);

  const handleSelect = async (coin) => {
    setOpen(false);
    setQuery("");

    if (coin.market_cap && coin.current_price) {
      onSelectCoin(coin);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false&tickers=false&market_data=true`
      );
      const data = res.data.market_data;
      onSelectCoin({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.large || coin.thumb || coin.image,
        market_cap: data.market_cap?.usd,
        circulating_supply: data.circulating_supply,
        current_price: data.current_price?.usd,
      });
    } catch (err) {
      console.error("Error fetching coin details:", err);
      setError("Failed to load coin details.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative w-80 font-sans" ref={containerRef}>
      <div
        onClick={() => {
          setOpen(!open);
          if (!open) {
            fetchCoins(query);
          }
        }}
        className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer bg-white shadow-sm hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200"
      >
        {selectedCoin ? (

          <div className="flex items-center gap-3 w-full">
            <img
              src={selectedCoin.image}
              alt={selectedCoin.name}
              className="w-7 h-7 rounded-full object-contain"
            />
            <span className="font-medium text-gray-800 truncate">{selectedCoin.name}</span>
            {selectedCoin.current_price && (
              <span className="text-sm text-gray-600 ml-auto whitespace-nowrap">
                ${selectedCoin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
        ) : (
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            className="flex-grow outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            onClick={(e) => e.stopPropagation()}
          />
        )}
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      {open && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-80 overflow-hidden z-50 animate-fade-in-down">
          {selectedCoin && (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search coins..."
              className="w-full p-3 border-b border-gray-200 outline-none focus:border-blue-400 transition-all duration-200 text-gray-700"
            />
          )}
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {loading && <div className="p-4 text-center text-blue-500">Loading...</div>}
            {error && <div className="p-4 text-center text-red-500">{error}</div>}
            {!loading && !error && coins.length === 0 && query.length > 1 && (
              <div className="p-4 text-center text-gray-500">No results found.</div>
            )}
            {!loading && !error && coins.length > 0 && (
              <ul>
                {coins.map((coin) => (
                  <li
                    key={coin.id}
                    onClick={() => handleSelect(coin)}
                    className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                  >
                    <img
                      src={coin.large || coin.thumb || coin.image}
                      alt={coin.name}
                      className="w-6 h-6 rounded-full object-contain"
                    />
                    <span className="font-medium text-gray-800">{coin.name}</span>
                    <span className="text-sm text-gray-500 ml-auto">
                      ({coin.symbol?.toUpperCase()})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinSelect;