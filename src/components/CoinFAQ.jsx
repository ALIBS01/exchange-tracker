const CoinFAQ = ({ coinName }) => {
  const faqs = [
    {
      question: `What is ${coinName}?`,
      answer: `${coinName} is a cryptocurrency used for decentralized finance, transactions, and other blockchain applications.`,
    },
    {
      question: `How can I buy ${coinName}?`,
      answer: `You can buy ${coinName} from trusted exchanges such as Binance, Coinbase, or other regulated platforms.`,
    },
    {
      question: `Is ${coinName} a good investment?`,
      answer: `This depends on your investment goals. Always research and consider market trends before investing in ${coinName}.`,
    },
  ];

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>

      <div className="divide-y divide-gray-200">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group py-5 cursor-pointer transition-all duration-300 ease-in-out"
          >
            <summary className="flex justify-between items-center font-medium text-gray-800 list-none text-base">
              <span>{faq.question}</span>
              <svg
                className="w-5 h-5 text-gray-500 group-open:rotate-180 transform transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <div className="overflow-hidden transition-all duration-300 ease-in-out">
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default CoinFAQ;
