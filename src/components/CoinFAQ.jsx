const CoinFAQ = ({ coinName }) => {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Frequently Asked Questions
      </h2>

      <div className="rounded-2xl bg-white shadow-md space-y-4 p-4">
        <details className="group p-6 cursor-pointer">
          <summary className="flex justify-between items-center font-medium text-gray-800">
            <span>What is {coinName}?</span>
            <svg
              className="w-5 h-5 text-gray-500 group-open:rotate-180 transform transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="mt-4 text-gray-600">
            {coinName} is a cryptocurrency used for decentralized finance, transactions, and other blockchain applications.
          </p>
        </details>

        <details className="group p-6 cursor-pointer">
          <summary className="flex justify-between items-center font-medium text-gray-800">
            <span>How can I buy {coinName}?</span>
            <svg
              className="w-5 h-5 text-gray-500 group-open:rotate-180 transform transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="mt-4 text-gray-600">
            You can buy {coinName} from trusted exchanges such as Binance, Coinbase, or other regulated platforms.
          </p>
        </details>

        <details className="group p-6 cursor-pointer">
          <summary className="flex justify-between items-center font-medium text-gray-800">
            <span>Is {coinName} a good investment?</span>
            <svg
              className="w-5 h-5 text-gray-500 group-open:rotate-180 transform transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <p className="mt-4 text-gray-600">
            This depends on your investment goals. Always research and consider market trends before investing in {coinName}.
          </p>
        </details>
      </div>
    </div>
  );
};

export default CoinFAQ;
