import { useState, useEffect } from "react";
import axios from "axios";

const useGlobalData = () => {
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = "https://api.coingecko.com/api/v3/global";

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const res = await axios.get(BASE_URL, {
          params: { x_cg_demo_api_key: API_KEY },
        });
        setGlobalData(res.data.data);
      } catch (err) {
        console.error("Global data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  return { globalData, loading };
};

export default useGlobalData;
