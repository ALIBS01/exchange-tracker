import { Link } from "react-router-dom";
import Search from "../components/Search";
import SettingsPanel from "../components/SettingsPanel";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";

const Navbar = () => {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center relative">
      <h1 className="text-xl font-bold text-gray-800">
        <Link to="/">CoinMeta</Link>
      </h1>

      <div className="flex items-center space-x-6">
        <Search />

        <button
          onClick={() => setShowSettings((prev) => !prev)}
          className="text-gray-600 hover:text-gray-800"
          title="Settings"
        >
          <FiSettings size={20} />
        </button>
      </div>


      {showSettings && (
        <div className="absolute top-16 right-4 z-50">
          <SettingsPanel />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
