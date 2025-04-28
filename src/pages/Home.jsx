import { useState } from "react";
import CurrencyList from "../components/CurrencyList";
import CryptoList from "../components/CryptoList";
import CurrencyChart from "../components/CurrencyChart";

const Home = () => {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");

  return (
    <div className="p-4">
      <CryptoList onCurrencySelect={setSelectedCoin} />
      <CurrencyChart coinId={selectedCoin} />
    </div>
  );
};

export default Home;
