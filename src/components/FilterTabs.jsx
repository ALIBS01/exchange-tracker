const filters = ["Trending", "Top Gainers", "Most Visited"];

const FilterTabs = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-4 mb-6 px-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onSelect(filter)}
          className={`px-3 py-1 rounded-full border transition-all duration-200 shadow-sm hover:shadow-md ${
            selected === filter
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;