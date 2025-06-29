import { useState } from "react";
import useFetchData from "../hooks/useFetchData";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const { data, loading, error } = useFetchData("/coins/categories");
  const navigate = useNavigate();

  const perPage = 50;
  const [page, setPage] = useState(1);

  const pagedData = data?.slice((page - 1) * perPage, page * perPage) || [];
  const totalPages = Math.ceil((data?.length || 0) / perPage);

  if (loading) return <p className="p-4">Loading categories...</p>;
  if (error) return <p className="p-4 text-red-500">Error loading categories.</p>;

  return (
    <section className="p-4 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Crypto Categories</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">#</th>
              <th className="p-4 text-left text-sm font-semibold">Category</th>
              <th className="p-4 text-right text-sm font-semibold">Top Gainers</th>
              <th className="p-4 text-right text-sm font-semibold">Market Cap</th>
              <th className="p-4 text-right text-sm font-semibold">24h Change</th>
              <th className="p-4 text-right text-sm font-semibold">24h Volume</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.map((category, index) => (
              <tr
                key={category.id}
                className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/category/${category.id}`)}
              >
                <td className="p-4">{(page - 1) * perPage + index + 1}</td>
                <td className="p-4">{category.name}</td>
                <td className="p-4 text-right flex justify-end space-x-2">
                  {category.top_3_coins?.map((coin, idx) => (
                    <img key={idx} src={coin} alt="coin" className="w-6 h-6 rounded-full" />
                  ))}
                </td>
                <td className="p-4 text-right">${category.market_cap?.toLocaleString()}</td>
                <td
                  className={`p-4 text-right ${
                    category.market_cap_change_24h > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {(category.market_cap_change_24h || 0).toFixed(2)}%
                </td>
                <td className="p-4 text-right">${category.volume_24h?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-8">
        <ul className="flex gap-2 text-black font-semibold items-center">
          <li>
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${
                page === 1 ? "text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              &lt;
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p <= 3 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce((acc, p, i, arr) => {
              if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === "..." ? (
                <li key={idx} className="px-3 py-1 text-gray-400 select-none">
                  ...
                </li>
              ) : (
                <li key={p}>
                  <button
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded cursor-pointer hover:bg-gray-200 ${
                      p === page ? "bg-gray-300" : ""
                    }`}
                  >
                    {p}
                  </button>
                </li>
              )
            )}

          <li>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded hover:bg-gray-200 ${
                page === totalPages ? "text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              &gt;
            </button>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Categories;
