import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CoinDetail from "./pages/CoinDetail";
import Ranking from "./pages/Ranking";
import Categories from "./pages/Categories";
import Chains from "./pages/Chains";
import Highlights from "./pages/Highlights";
import NewCryptocurrencies from "./pages/NewCryptocurrencies";
import GainersLosers from "./pages/GainersLosers";
import CompareCoinsNFT from "./pages/CompareCoinsNFT";
import Converter from "./pages/Converter";
import GlobalChart from "./pages/GlobalChart";
import CryptoExchanges from "./pages/CryptoExchanges";
import DecentralizedExchanges from "./pages/DecentralizedExchanges";
import Derivatives from "./pages/Derivatives";
import NFTFloorPrice from "./pages/NFTFloorPrice";
import NFTRelatedCoins from "./pages/NFTRelatedCoins";
import NFTGlobalChart from "./pages/NFTGlobalChart";
import CommunityBlog from "./pages/CommunityBlog";
import { SettingsProvider } from "./context/SettingsContext";
import HighVolume from "./pages/HighVolume";
import NewCoins from "./pages/NewCoins";

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

            <Route path="/ranking" element={<Ranking />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/chains" element={<Chains />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/new-cryptocurrencies" element={<NewCryptocurrencies />} />
            <Route path="/gainers-losers" element={<GainersLosers />} />
            <Route path="/compare" element={<CompareCoinsNFT />} />
            <Route path="/converter" element={<Converter />} />
            <Route path="/global-chart" element={<GlobalChart />} />

            <Route path="/exchanges" element={<CryptoExchanges />} />
            <Route path="/exchanges/decentralized" element={<DecentralizedExchanges />} />
            <Route path="/exchanges/derivatives" element={<Derivatives />} />

            <Route path="/nft/floor-price" element={<NFTFloorPrice />} />
            <Route path="/nft/related-coins" element={<NFTRelatedCoins />} />
            <Route path="/nft/global-chart" element={<NFTGlobalChart />} />

            <Route path="/community/blog" element={<CommunityBlog />} />
          </Routes>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
