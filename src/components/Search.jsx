import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import useFetchData from "../hooks/useFetchData";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [filteredCoins, setFilteredCoins] = useState([]);
  const navigate = useNavigate();

  const { data: coins } = useFetchData("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 250,
    page: 1,
    sparkline: false,
  });

  useEffect(() => {
    if (query.length === 0) {
      setFilteredCoins([]);
      return;
    }

    const results = coins?.filter((coin) =>
      coin.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCoins(results || []);
  }, [query, coins]);

  return (
    <div className="relative w-64">
      <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
        <Search className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search coins..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {filteredCoins.length > 0 && (
        <ul className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-xl w-full shadow-lg max-h-60 overflow-y-auto">
          {filteredCoins.slice(0, 8).map((coin) => (
            <li
              key={coin.id}
              onClick={() => {
                navigate(`/coin/${coin.id}`);
                setQuery("");
              }}
              className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              <img src={coin.image} alt={coin.name} className="w-5 h-5" />
              {coin.name}
              <span className="text-gray-400 uppercase text-xs ml-auto">
                {coin.symbol}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
