import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I withdraw my earnings?',
    answer: 'You can withdraw your earnings once you reach the minimum threshold of $50. Go to your Wallet page, click "Withdraw", enter the amount, and choose your preferred payment method. Withdrawals are processed within 3-5 business days.'
  },
  {
    question: 'When will I receive my commission?',
    answer: 'Commissions are credited to your account immediately after an order is marked as completed. The funds become available for withdrawal after a 7-day holding period to ensure order quality and prevent fraud.'
  },
  {
    question: 'How does the referral program work?',
    answer: 'Share your unique referral link with others. When someone signs up using your link and completes their first order, you earn a 10% bonus commission. Your referrals also earn higher commission rates, creating a win-win situation.'
  },
  {
    question: 'What payment methods are supported?',
    answer: 'We support PayPal, bank transfer, and cryptocurrency (Bitcoin, USDT). You can add and manage your payment methods in the Account Settings page under the Payment Methods section.'
  },
  {
    question: 'Why is my account pending verification?',
    answer: 'Account verification ensures platform security and compliance. Please upload a valid government-issued ID and proof of address in the Account Settings. Verification typically takes 24-48 hours.'
  },
  {
    question: 'How do I complete an order?',
    answer: 'Click on any available order in your Dashboard, review the requirements carefully, click "Accept Order", and follow the instructions provided. Once completed, submit proof of completion and wait for approval.'
  },
  {
    question: 'What happens if an order is rejected?',
    answer: 'If your order submission doesn\'t meet the requirements, it will be rejected with feedback. You can resubmit with corrections within 24 hours. Repeated rejections may affect your account rating.'
  },
  {
    question: 'Can I cancel an accepted order?',
    answer: 'Yes, but cancellations affect your completion rate. Go to the Orders page, find the order, and click "Cancel Order". Frequent cancellations may result in account restrictions or lower priority for new orders.'
  },
  {
    question: 'How do commission tiers work?',
    answer: 'Your commission rate increases based on your total completed orders: Bronze (5%), Silver (7%), Gold (10%), Platinum (12%), Diamond (15%). Higher tiers unlock faster withdrawals and exclusive order access.'
  },
  {
    question: 'Is there a mobile app available?',
    answer: 'Currently, we offer a fully responsive web platform that works seamlessly on mobile browsers. A dedicated mobile app for iOS and Android is in development and will be released in Q3 2024.'
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <i className="ri-question-line text-xl text-blue-600 w-5 h-5 flex items-center justify-center"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-600">Find quick answers to common questions</p>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors cursor-pointer text-left"
            >
              <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
              <i
                className={`ri-arrow-down-s-line text-xl text-gray-600 transition-transform duration-300 w-5 h-5 flex items-center justify-center flex-shrink-0 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              ></i>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Still Need Help */}
      <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Still need help?</strong> Contact our support team using the form above or start a live chat.
        </p>
      </div>
    </div>
  );
}