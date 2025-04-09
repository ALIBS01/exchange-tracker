import { useEffect, useState } from "react";
import axios from "axios";


const useFetchData = (endpoint, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = 'https://api.coingecko.com/api/v3';
  console.log(API_KEY);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          headers: {
            'x-cg-demo-api-key': API_KEY
          },
          params: params
        });
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(params)]);

  return { data, loading, error };
};

export default useFetchData;
