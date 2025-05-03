import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [coins, setCoins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoins = async () => {
      if (query.length < 2) {
        setCoins([]);
        return;
      }

      try {
        const res = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
        const data = await res.json();
        setCoins(data.coins);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    const timeout = setTimeout(() => {
      fetchCoins();
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (id) => {
    navigate(`/coin/${id}`);
    setQuery("");
    setCoins([]);
  };

  return (
    <div className="relative max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search coins..."
        className="w-full border px-4 py-2 rounded-lg shadow"
      />
      {coins.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border mt-1 rounded-lg shadow">
          {coins.map((coin) => (
            <li
              key={coin.id}
              onClick={() => handleSelect(coin.id)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img src={coin.thumb} alt={coin.name} className="w-5 h-5" />
                <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
