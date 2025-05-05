import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TrendingList = () => {
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = "https://api.coingecko.com/api/v3";

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/search/trending`, {
          params: {
            x_cg_demo_api_key: API_KEY,
          },
        });

        setTrendingCoins(res.data.coins || []);
      } catch (err) {
        console.error("Trending fetch error", err);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      setIsDragging(false);
      container.classList.add("cursor-grabbing");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      setIsDragging(true);
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleCardClick = (itemId) => {
    if (!isDragging) {
      navigate(`/coin/${itemId}`);
    }
  };

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🔥 Trending Coins</h2>
      <div
        ref={containerRef}
        className="flex space-x-4 pb-2 overflow-x-auto no-scrollbar cursor-grab select-none"
      >
        {trendingCoins.map(({ item }) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className="min-w-[150px] bg-white p-4 rounded-2xl shadow hover:scale-105 transition cursor-pointer"
          >
            <img
              src={item.small}
              alt={item.name}
              className="w-12 h-12 mx-auto mb-2 pointer-events-none"
            />
            <h3 className="text-center font-semibold text-sm">{item.name}</h3>
            <p className="text-center text-gray-500 text-xs">{item.symbol.toUpperCase()}</p>
            <p className="text-center text-green-500 text-xs mt-1">
              Rank #{item.market_cap_rank}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingList;
