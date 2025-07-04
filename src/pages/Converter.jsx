import { useState, useEffect } from "react";
import useFetchData from "../hooks/useFetchData";

const Converter = () => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [currencyLoading, setCurrencyLoading] = useState(true);
  const [currencyError, setCurrencyError] = useState(null);

  const {
    data: topCoins,
    loading: topCoinsLoading,
    error: topCoinsError,
  } = useFetchData("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: 50,
    page: 1,
    sparkline: false,
  });

  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState({ id: "usd", name: "USD" });
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState("0.000000");
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [conversionLoading, setConversionLoading] = useState(false);

  useEffect(() => {
    const fetchSupportedCurrencies = async () => {
      try {
        setCurrencyLoading(true);
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/supported_vs_currencies"
        );
        const data = await response.json();
        const formatted = data.map((id) => ({ id, name: id.toUpperCase() }));
        setSupportedCurrencies(formatted);
        setSelectedCurrency(formatted.find((cur) => cur.id === "usd") || formatted[0]);
      } catch (e) {
        setCurrencyError(e.message);
      } finally {
        setCurrencyLoading(false);
      }
    };
    fetchSupportedCurrencies();
  }, []);

  useEffect(() => {
    if (topCoins && topCoins.length > 0 && !selectedCoin) {
      setSelectedCoin(topCoins[0]);
    }
  }, [topCoins, selectedCoin]);

  useEffect(() => {
    if (!selectedCoin || !selectedCurrency.id || amount === "" || isNaN(parseFloat(amount))) {
      setConvertedAmount("0.000000");
      return;
    }

    const fetchConversion = async () => {
      setConversionLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${selectedCoin.id}&vs_currencies=${selectedCurrency.id}`
        );
        const data = await response.json();
        const price = data[selectedCoin.id]?.[selectedCurrency.id];
        if (price) {
          setConvertedAmount((parseFloat(amount) * price).toFixed(6));
          setLastUpdated(new Date().toLocaleTimeString());
        } else {
          setConvertedAmount("N/A");
        }
      } catch {
        setConvertedAmount("Error");
      } finally {
        setConversionLoading(false);
      }
    };
    fetchConversion();
  }, [amount, selectedCoin, selectedCurrency]);

  if (topCoinsLoading || currencyLoading) return <div className="text-center py-10">Loading...</div>;
  if (topCoinsError || currencyError)
    return <div className="text-center py-10 text-red-600">Error: {topCoinsError?.message || currencyError}</div>;

  return (
    <div className="bg-white mt-12 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto font-sans">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Cryptocurrency Converter Calculator
        </h1>
        <p className="text-gray-500 mt-2">
          Check the latest cryptocurrency prices against all global currencies.
        </p>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Amount</label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              placeholder="1.00"
            />
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Coin</label>
            <select
              value={selectedCoin?.id || ""}
              onChange={(e) =>
                setSelectedCoin(topCoins.find((coin) => coin.id === e.target.value))
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
            >
              {topCoins.map((coin) => (
                <option key={coin.id} value={coin.id}>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Currency</label>
            <select
              value={selectedCurrency.id}
              onChange={(e) =>
                setSelectedCurrency(
                  supportedCurrencies.find((cur) => cur.id === e.target.value)
                )
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg"
            >
              {supportedCurrencies.map((cur) => (
                <option key={cur.id} value={cur.id}>
                  {cur.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedCoin && (
          <div className="mt-8 text-left">
            <p className="text-2xl text-gray-800">
              <span className="font-bold">
                {amount} {selectedCoin.symbol.toUpperCase()}
              </span>{" "}
              ={" "}
              <span className="font-bold text-blue-600">
                {conversionLoading ? "Loading..." : convertedAmount}{" "}
                {selectedCurrency.name}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Last updated at {lastUpdated}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Converter;
