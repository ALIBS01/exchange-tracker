const CoinFAQ = ({ coinName }) => {
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        <details className="group rounded-2xl bg-white py-4 cursor-pointer">
          <summary className="flex justify-between items-center font-medium text-gray-800 px-0 sm:px-0 md:px-0">
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
          <p className="mt-4 text-gray-600 text-sm leading-relaxed px-0 sm:px-0 md:px-0">
            {coinName} is a cryptocurrency used for decentralized finance, transactions, and other blockchain applications.
          </p>
        </details>

        <details className="group rounded-2xl bg-white py-4 cursor-pointer">
          <summary className="flex justify-between items-center font-medium text-gray-800 px-0">
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
          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            You can buy {coinName} from trusted exchanges such as Binance, Coinbase, or other regulated platforms.
          </p>
        </details>

        <details className="group rounded-2xl bg-white py-4 cursor-pointer">
          <summary className="flex justify-between items-center font-medium text-gray-800 px-0">
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
          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            This depends on your investment goals. Always research and consider market trends before investing in {coinName}.
          </p>
        </details>
      </div>
    </div>
  );
};

export default CoinFAQ;
