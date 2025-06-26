import TrendingCoins from "../components/TrendingCoins";
import TopGainers from "../components/TopGainers";
import TopLosers from "../components/TopLosers";
import NewlyAddedCoins from "../components/NewlyAddedCoins";
import HighestVolumeCoins from "../components/HighestVolumeCoins";
import PriceChangeATH from "../components/PriceChangeATH";

const Highlights = () => {
  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Highlights</h2>

      <TrendingCoins />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopGainers />
        <TopLosers />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NewlyAddedCoins />
        <HighestVolumeCoins />
      </div>

      <PriceChangeATH />
    </div>
  );
};

export default Highlights;
