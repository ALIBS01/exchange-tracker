import { Link } from "react-router-dom";
import Search from "../components/Search";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Currency & Crypto Tracker</h1>
      <div className="flex items-center space-x-6">
        <Search />
        <ul className="flex space-x-4 text-sm sm:text-base">
          <li>
            <Link to="/" className="text-gray-700 hover:text-blue-500">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-gray-700 hover:text-blue-500">
              About
            </Link>
          </li>
          <li>
            <Link to="/settings" className="text-gray-700 hover:text-blue-500">
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
