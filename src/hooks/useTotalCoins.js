import { useEffect, useState } from "react";
import axios from "axios";

const useTotalCoins = () => {
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/list");
        setTotal(response.data.length);
      } catch (error) {
        console.error("Error fetching total coins", error);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, []);

  return { total, loading };
};

export default useTotalCoins;
