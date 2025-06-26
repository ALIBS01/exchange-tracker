import TopGainers from "../components/TopGainers";
import TopLosers from "../components/TopLosers";
import NewlyAddedCoins from "../components/NewlyAddedCoins";
import HighestVolumeCoins from "../components/HighestVolumeCoins";
import TrendingCoins from "../components/TrendingCoins";
import PriceChangeATH from "../components/PriceChangeATH";

const Highlights = () => {
  return (
    <section className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TopGainers />
        <TopLosers />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NewlyAddedCoins />
        <HighestVolumeCoins />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrendingCoins />
        <PriceChangeATH />
      </div>
    </section>
  );
};

export default Highlights;
