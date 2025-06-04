import { Link } from "react-router-dom";
import Search from "../components/Search";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800"><Link to="/">CoinMeta</Link></h1>
      <div className="flex items-center space-x-6">
        <Search />
        <ul className="flex space-x-4 text-sm sm:text-base">
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
