const FilterTabs = ({ selected, onSelect }) => {
    const filters = ["All", "Trending", "New", "Gainers"];
  
    return (
      <div className="flex flex-wrap gap-3 mb-6">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onSelect(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              selected === filter
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            } hover:bg-blue-100 transition`}
          >
            {filter}
          </button>
        ))}
      </div>
    );
  };
  
  export default FilterTabs;
  