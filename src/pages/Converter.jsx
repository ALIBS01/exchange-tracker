import { useState, useEffect, useRef } from "react";
import useFetchData from "../hooks/useFetchData";

const CustomDropdown = ({
  label,
  selectedOption,
  onSelect,
  searchTerm,
  onSearchTermChange,
  options,
  isLoading,
  displayRenderer,
  optionRenderer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      onSearchTermChange("");
    }
  };

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    onSearchTermChange("");
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    onSearchTermChange(e.target.value);
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="w-full md:w-1/3" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div
          onClick={handleToggle}
          className={`w-full px-4 h-[50px] bg-gray-50 border border-gray-300 rounded-lg cursor-pointer flex items-center justify-between ${
            isOpen ? "ring-2 ring-green-500" : ""
          }`}
        >
          {!isOpen && selectedOption ? (
            displayRenderer(selectedOption)
          ) : (
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-full"
              value={searchTerm}
              onChange={handleInputChange}
              onClick={handleInputClick}
            />
          )}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-72 flex flex-col">
            <ul className="overflow-y-auto">
              {isLoading ? (
                <li className="px-4 py-3 text-gray-500">Searching...</li>
              ) : options.length > 0 ? (
                options.map((option) => (
                  <li
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <div className="flex-grow">{optionRenderer(option)}</div>
                    {selectedOption?.id === option.id && (
                      <svg
                        className="w-5 h-5 text-green-500 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-gray-500">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

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
    per_page: 20,
    page: 1,
    sparkline: false,
  });

  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState("0.000000");
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );
  const [conversionLoading, setConversionLoading] = useState(false);

  const [coinSearchTerm, setCoinSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [currencySearchTerm, setCurrencySearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (coinSearchTerm) {
        setIsSearching(true);
        fetch(`https://api.coingecko.com/api/v3/search?query=${coinSearchTerm}`)
          .then((res) => res.json())
          .then((data) => {
            const adaptedResults = data.coins.map((c) => ({
              ...c,
              image: c.thumb,
            }));
            setSearchResults(adaptedResults);
            setIsSearching(false);
          });
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [coinSearchTerm]);

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
        setSelectedCurrency(
          formatted.find((cur) => cur.id === "usd") || formatted[0]
        );
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
  }, [topCoins]);

  useEffect(() => {
    if (
      !selectedCoin ||
      !selectedCurrency ||
      amount === "" ||
      isNaN(parseFloat(amount))
    ) {
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

    const debounce = setTimeout(() => {
      fetchConversion();
    }, 500);

    return () => clearTimeout(debounce);
  }, [amount, selectedCoin, selectedCurrency]);

  if (topCoinsLoading || currencyLoading)
    return <div className="text-center py-10">Loading...</div>;
  if (topCoinsError || currencyError)
    return (
      <div className="text-center py-10 text-red-600">
        Error: {topCoinsError?.message || currencyError}
      </div>
    );

  const coinOptions = coinSearchTerm ? searchResults : topCoins;
  const currencyOptions = supportedCurrencies.filter((c) =>
    c.name.toLowerCase().includes(currencySearchTerm.toLowerCase())
  );

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
        <div className="flex flex-col md:flex-row items-end justify-between gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Amount
            </label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition h-[50px]"
              placeholder="1.00"
            />
          </div>

          <CustomDropdown
            label="Select Coin"
            selectedOption={selectedCoin}
            onSelect={setSelectedCoin}
            searchTerm={coinSearchTerm}
            onSearchTermChange={setCoinSearchTerm}
            options={coinOptions || []}
            isLoading={isSearching}
            displayRenderer={(option) => (
              <div className="flex items-center">
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-6 h-6 mr-2 rounded-full"
                />
                <span className="font-medium">
                  {option.name} ({option.symbol.toUpperCase()})
                </span>
              </div>
            )}
            optionRenderer={(option) => (
              <div className="flex items-center">
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-6 h-6 mr-3 rounded-full"
                />
                <span className="font-medium text-gray-800">
                  {option.name} ({option.symbol.toUpperCase()})
                </span>
              </div>
            )}
          />

          <CustomDropdown
            label="Select Currency"
            selectedOption={selectedCurrency}
            onSelect={setSelectedCurrency}
            searchTerm={currencySearchTerm}
            onSearchTermChange={setCurrencySearchTerm}
            options={currencyOptions}
            isLoading={false}
            displayRenderer={(option) => (
              <span className="font-medium">{option.name}</span>
            )}
            optionRenderer={(option) => (
              <span className="font-medium text-gray-800">{option.name}</span>
            )}
          />
        </div>

        {selectedCoin && selectedCurrency && (
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