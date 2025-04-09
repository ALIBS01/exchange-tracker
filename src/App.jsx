import useFetchData from "./hooks/useFetchData";

function App() {
  const { data, loading, error } = useFetchData("/exchange_rates");

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Live Exchange Rates 🌍</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(data.rates).map(([code, info]) => (
          <div key={code} className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-md border border-white/20">
            <h2 className="text-xl font-semibold">{info.name}</h2>
            <p className="text-sm text-gray-300 uppercase">{code}</p>
            <p className="mt-2 text-lg font-bold">{info.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
