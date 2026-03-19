import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does PromoEarn work?',
      answer: 'PromoEarn connects you with e-commerce platforms like Amazon, Alibaba, and AliExpress. You complete simple purchase orders, and earn commission on each completed order. The process is automated, secure, and designed for anyone to start earning immediately.',
      icon: 'ri-question-line'
    },
    {
      question: 'How much money can I earn?',
      answer: 'Earnings depend on your account balance tier and activity level. Commission rates range from 4-12%. Users typically complete 5-10 orders daily, earning $20-180 per day. Top earners make $3,000-5,000+ monthly. Your earnings grow as your balance increases.',
      icon: 'ri-money-dollar-circle-line'
    },
    {
      question: 'Is there a joining fee?',
      answer: 'No, joining PromoEarn is completely free. There are no signup fees, monthly subscriptions, or hidden charges. You only need to deposit an initial balance to start receiving order assignments. This balance remains yours and can be withdrawn anytime.',
      icon: 'ri-price-tag-3-line'
    },
    {
      question: 'What is the minimum deposit required?',
      answer: 'The minimum initial deposit is $50. This unlocks the Amazon tier with 4% commission. Higher deposits unlock better commission rates: $401-800 for Alibaba (8%), and $800+ for AliExpress (12%). Your deposit is always withdrawable.',
      icon: 'ri-wallet-3-line'
    },
    {
      question: 'How long does it take to receive payouts?',
      answer: 'Withdrawals are processed within 24-48 hours. We support multiple payment methods including bank transfer, PayPal, cryptocurrency, and e-wallets. The minimum withdrawal amount is $50, and a standard 5% processing fee applies.',
      icon: 'ri-time-line'
    },
    {
      question: 'Are there any risks involved?',
      answer: 'PromoEarn is a legitimate earning platform with bank-level security. Your funds are protected with SSL encryption and two-factor authentication. We partner with verified e-commerce platforms. However, like any investment, start with an amount you\'re comfortable with.',
      icon: 'ri-shield-check-line'
    },
    {
      question: 'Can I work from anywhere?',
      answer: 'Yes! PromoEarn is 100% online and accessible worldwide. Work from home, a café, or while traveling. All you need is a device with internet connection. Complete orders at your own pace, anytime that suits your schedule.',
      icon: 'ri-global-line'
    },
    {
      question: 'How does the referral program work?',
      answer: 'Invite friends using your unique referral link. You earn 5% commission on all their earnings for life. There\'s no limit to how many people you can refer. Many users earn significant passive income through referrals alone.',
      icon: 'ri-share-line'
    },
    {
      question: 'What happens if I complete an order incorrectly?',
      answer: 'Each order comes with clear step-by-step instructions. If an error occurs, our support team will guide you through resolution. Orders are verified automatically, and commissions are credited only after successful verification.',
      icon: 'ri-error-warning-line'
    },
    {
      question: 'How many orders can I complete per day?',
      answer: 'Most users complete 5-10 orders daily, but there\'s no strict limit. Order availability depends on your balance tier and platform demand. Higher balance tiers typically receive more order assignments throughout the day.',
      icon: 'ri-shopping-cart-line'
    },
    {
      question: 'Is customer support available?',
      answer: 'Yes! We offer 24/7 customer support via live chat, email, and comprehensive FAQ. Our support team responds within minutes and helps with account setup, order issues, withdrawals, and any questions you have.',
      icon: 'ri-customer-service-2-line'
    },
    {
      question: 'Can I withdraw my initial deposit?',
      answer: 'Yes, your initial deposit and all earnings can be withdrawn anytime. Simply submit a withdrawal request from your dashboard. Processing takes 24-48 hours. Note that withdrawing your balance will affect your commission tier.',
      icon: 'ri-bank-card-line'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <i className="ri-questionnaire-line text-orange-600"></i>
            <span className="text-sm font-semibold text-orange-600">Got Questions?</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about PromoEarn. Can't find your answer? Contact our 24/7 support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border-2 border-gray-100 hover:border-orange-200 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openIndex === index
                      ? 'bg-gradient-to-br from-orange-500 to-amber-600'
                      : 'bg-gray-100'
                  }`}>
                    <i className={`${faq.icon} text-2xl ${
                      openIndex === index ? 'text-white' : 'text-gray-600'
                    }`}></i>
                  </div>
                  <h3 className={`text-lg font-bold transition-colors ${
                    openIndex === index ? 'text-orange-600' : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </h3>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  openIndex === index
                    ? 'bg-orange-100 rotate-180'
                    : 'bg-gray-100'
                }`}>
                  <i className={`ri-arrow-down-s-line text-xl ${
                    openIndex === index ? 'text-orange-600' : 'text-gray-600'
                  }`}></i>
                </div>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pl-[88px]">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 border-2 border-orange-200 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="ri-customer-service-2-line text-white text-3xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Still Have Questions?
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Our support team is available 24/7 to help you. Get instant answers via live chat or email us anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/support"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all whitespace-nowrap cursor-pointer"
            >
              <i className="ri-chat-3-line"></i>
              Live Chat Support
            </a>
            <a
              href="mailto:support@promoearn.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-orange-300 transition-all whitespace-nowrap cursor-pointer"
            >
              <i className="ri-mail-line"></i>
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}