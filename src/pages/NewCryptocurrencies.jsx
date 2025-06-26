import CryptoList from "../components/CryptoList";

const NewCryptocurrencies = () => {
  return (
    <div className="p-4">
      <CryptoList defaultFilter="new" />
    </div>
  );
};

export default NewCryptocurrencies;
