import TopGainers from "../components/TopGainers";
import TopLosers from "../components/TopLosers";
import NewlyAddedCoins from "../components/NewlyAddedCoins";
import HighestVolumeCoins from "../components/HighestVolumeCoins";
import TrendingCoins from "../components/TrendingCoins";
import PriceChangeATH from "../components/PriceChangeATH";

const Highlights = () => {
  return (
    <section className="px-4 py-10 space-y-6 dark:bg-gray-900">
      <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-gray-200">Crypto Highlights</h1>
      <p className="mb-6 dark:text-gray-400">Curious about the hottest cryptocurrencies right now? Explore and keep up with the coins capturing the most attention across global markets and community trends.</p>
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
