const tabs = [
    { label: "Trending", value: "trending" },
    { label: "New", value: "new" },
    { label: "Gainers", value: "gainers" },
    { label: "Most Visited", value: "most_visited" },
  ];
  
  const FilterTabs = ({ selected, onSelect }) => {
    return (
      <div className="flex space-x-3 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onSelect?.(tab.value)}
            className={`py-2 px-4 border-b-2 transition-colors duration-200 ${
              selected === tab.value
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };
  
  export default FilterTabs;
  