import { useState } from "react";
import CryptoList from "../components/CryptoList";
import CurrencyChart from "../components/CurrencyChart";
import TrendingList from "../components/TrendingList";

const Home = () => {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");

  return (
    <div className="p-4">
      <TrendingList onCoinSelect={setSelectedCoin} />
      <CryptoList onCurrencySelect={setSelectedCoin} />
      <CurrencyChart coinId={selectedCoin} />
    </div>
  );
};

export default Home;
