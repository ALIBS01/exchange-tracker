import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

const formatCurrency = (num) => {
  if (!num) return '$0';
  if (num > 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (num > 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num > 1_000) {
    return `$${(num / 1_000).toFixed(1)}K`;
  }
  return `$${num.toString()}`;
};


const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const debounceTimeoutRef = useRef(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleCoinClick = (coinId) => {
    navigate(`/coin/${coinId}`);
    closeModal();
  };

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const searchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchQuery}`);
      const searchData = await searchRes.json();
      if (!searchData.coins || searchData.coins.length === 0) {
        setResults([]);
        return;
      }
      const coinIds = searchData.coins.slice(0, 10).map(c => c.id).join(',');
      const marketsRes = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false`);
      const marketsData = await marketsRes.json();
      setResults(marketsData);
    } catch (error) {
      console.error("Error during search:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);
    return () => clearTimeout(debounceTimeoutRef.current);
  }, [query, performSearch]);
  
  useEffect(() => {
    if (isModalOpen) {
      inputRef.current?.focus();
    }
  }, [isModalOpen]);

  return (
    <>
      <div onClick={openModal} className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white shadow-sm cursor-pointer w-64 hover:border-gray-400 transition">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <span className="text-gray-500 text-sm">Search</span>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-16 md:pt-24 bg-opacity-40 backdrop-blur-sm" onClick={closeModal}>
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl p-2 md:p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <Search className="w-5 h-5 text-gray-500 mx-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for a coin..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-base text-gray-800 dark:text-gray-200"
              />
              <button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <ul className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
              {isSearching && <li className="px-4 py-3 text-sm text-center text-gray-500">Searching...</li>}
              {!isSearching && query && results.length === 0 && <li className="px-4 py-3 text-sm text-center text-gray-500">No results found.</li>}
              
              {results.map((coin) => (
                <li
                  key={coin.id}
                  onClick={() => handleCoinClick(coin.id)}
                  className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-4 rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-grow">
                    <img src={coin.image} alt={coin.name} className="w-8 h-8 flex-shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                        <span className="font-semibold text-gray-800 dark:text-gray-100 truncate">{coin.name}</span>
                        <span className="text-xs text-gray-500 uppercase">{coin.symbol}</span>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end text-xs text-gray-600 dark:text-gray-400 w-32 flex-shrink-0">
                      <span>{formatCurrency(coin.market_cap)}</span>
                      <span>{formatCurrency(coin.total_volume)}</span>
                  </div>

                  <div className="flex flex-col items-end w-28 flex-shrink-0">
                    <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                      ${coin.current_price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) ?? 'N/A'}
                    </span>
                    <span className={`text-sm font-semibold ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.price_change_percentage_24h?.toFixed(2) ?? '0.00'}%
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchBar;