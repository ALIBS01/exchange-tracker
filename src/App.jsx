import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CoinDetail from "./pages/CoinDetail";
import Ranking from "./pages/Ranking";
import Categories from "./pages/Categories";
import Highlights from "./pages/Highlights";
import NewCryptocurrencies from "./pages/NewCryptocurrencies";
import GainersLosers from "./pages/GainersLosers";
import CompareCoinsNFT from "./pages/CompareCoinsNFT";
import Converter from "./pages/Converter";
import GlobalChart from "./pages/GlobalChart";
import CryptoExchanges from "./pages/CryptoExchanges";
import Derivatives from "./pages/Derivatives";
import CommunityBlog from "./pages/CommunityBlog";
import { SettingsProvider } from "./context/SettingsContext";
import HighVolume from "./pages/HighVolume";
import NewCoins from "./pages/NewCoins";
import AthLosses from "./pages/AthLosses";
import Trending from "./pages/Trending";
import CategoryDetail from "./pages/CategoryDetail";
import ExchangeDetail from "./pages/ExchangeDetail";
import DerivativeDetail from "./pages/DerivativeDetail";

function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="min-h-screen bg-white text-gray-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
            <Route path="/high-volume" element={<HighVolume />} />
            <Route path="/new-coins" element={<NewCoins />} />
            <Route path="/ath-losses" element={<AthLosses />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/category/:id" element={<CategoryDetail />} />
            <Route path="/exchange/:id" element={<ExchangeDetail />} />
            <Route path="/derivatives/:id" element={<DerivativeDetail />} />

            <Route path="/ranking" element={<Ranking />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/new-cryptocurrencies" element={<NewCryptocurrencies />} />
            <Route path="/gainers-losers" element={<GainersLosers />} />
            <Route path="/compare" element={<CompareCoinsNFT />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/global-chart" element={<GlobalChart />} />

            <Route path="/exchanges" element={<CryptoExchanges />} />
            <Route path="/exchanges/derivatives" element={<Derivatives />} />

            <Route path="/community/blog" element={<CommunityBlog />} />
          </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
