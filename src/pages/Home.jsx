import CurrencyList from "../components/CurrencyList";
import CryptoList from "../components/CryptoList";
import CurrencyChart from "../components/CurrencyChart";

const Home = () => {
  return (
    <div>
      <CurrencyList />
      <CryptoList />
      <CurrencyChart />
    </div>
  );
};

export default Home;
