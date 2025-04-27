import { useEffect, useState } from "react";
import axios from "axios";

const useMarketData = (vsCurrency = "usd") => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = "https://api.coingecko.com/api/v3";

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/coins/markets`, {
          params: {
            vs_currency: vsCurrency,
            sparkline: true,
            x_cg_demo_api_key: API_KEY,
          },
        });
        setCoins(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [vsCurrency]);

  return { coins, loading, error };
};

export default useMarketData;
