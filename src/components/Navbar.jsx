import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { FiSettings } from "react-icons/fi";
import Search from "./Search";

const Navbar = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [hovered, setHovered] = useState(null);
    const timeoutRef = useRef(null);

  const handleMouseEnter = (title) => {
    clearTimeout(timeoutRef.current);
    setHovered(title);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHovered(null);
    }, 100);
  };

  const menu = [
    {
      title: "Cryptocurrencies",
      items: [
        { label: "Ranking", path: "/ranking" },
        { label: "Categories", path: "/categories" },
        { label: "Chains", path: "/chains" },
        { divider: true },
        { label: "Highlights", path: "/highlights" },
        { label: "New Cryptocurrencies", path: "/new-cryptocurrencies" },
        { label: "Gainers & Losers", path: "/gainers-losers" },
        { divider: true },
        { label: "Compare Coins", path: "/compare" },
        { label: "Converter", path: "/converter" },
        { label: "Global Chart", path: "/global-chart" },
      ],
    },
    {
      title: "Exchanges",
      items: [
        { label: "Crypto Exchanges", path: "/exchanges" },
        { label: "Derivatives", path: "/exchanges/derivatives" },
      ],
    },
    {
      title: "Community",
      items: [
        { label: "Blog", path: "/community/blog" },
      ],
    },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center relative z-50">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          <Link to="/">CoinMeta</Link>
        </h1>


{menu.map((section) => (
  <div
    key={section.title}
    className="relative"
    onMouseEnter={() => handleMouseEnter(section.title)}
    onMouseLeave={handleMouseLeave}
  >
    <button className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white px-2 py-1 cursor-pointer">
      {section.title}
    </button>

    {hovered === section.title && (
      <div
        className="absolute left-0 top-full mt-2 w-60 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700"
        onMouseEnter={() => clearTimeout(timeoutRef.current)}
        onMouseLeave={handleMouseLeave}
      >
        {section.items.map((item, index) =>
          item.divider ? (
            <hr key={index} className="my-1 border-gray-200 dark:border-gray-600" />
          ) : (
            <Link
              to={item.path}
              key={index}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {item.label}
            </Link>
          )
        )}
      </div>
    )}
  </div>
))}

      </div>


      <div className="flex items-center space-x-4">
        <Search />
        <button
          onClick={() => setShowSettings((prev) => !prev)}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <FiSettings size={20} />
        </button>
      </div>


    </nav>
  );
};

export default Navbar;
