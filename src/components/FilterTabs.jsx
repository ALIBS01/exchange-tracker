const filters = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
];

const FilterTabs = ({ activeFilter, onSelect }) => {
  return (
    <div className="flex gap-2 mb-4">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onSelect(filter.value)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
            activeFilter === filter.value
              ? "bg-blue-600 text-white"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
