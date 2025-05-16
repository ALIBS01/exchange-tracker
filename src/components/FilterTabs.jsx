import { useEffect, useState } from "react";

const tabs = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
];

const FilterTabs = ({ selected = "all", onSelect }) => {
  const [activeTab, setActiveTab] = useState(selected);

  useEffect(() => {
    setActiveTab(selected);
  }, [selected]);

  const handleClick = (tab) => {
    setActiveTab(tab);
    onSelect(tab);
  };

  return (
    <div className="flex space-x-4 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => handleClick(tab.value)}
          className={`px-4 py-2 rounded-full font-semibold transition cursor-pointer ${
            activeTab === tab.value
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;
