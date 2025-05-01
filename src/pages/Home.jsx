import { useState } from "react";
import CryptoList from "../components/CryptoList";
import TrendingList from "../components/TrendingList";

const Home = () => {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");

  return (
    <div className="p-4">
      <TrendingList onCoinSelect={setSelectedCoin} />
      <CryptoList onCurrencySelect={setSelectedCoin} />
    </div>
  );
};

export default Home;
