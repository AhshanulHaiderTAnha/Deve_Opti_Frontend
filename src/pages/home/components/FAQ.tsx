import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../context/SettingsContext';

export default function FAQ() {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<{ question: string; answer: string; icon: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/public/faqs`);
        const data = await res.json();
        if (res.ok) {
          const list = data.data || (Array.isArray(data) ? data : []);
          setFaqs(list);
        }
      } catch (err) {
        console.error('Failed to fetch FAQs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaqs();
  }, [API_BASE_URL]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full mb-4">
            <i className="ri-questionnaire-line text-orange-600"></i>
            <span className="text-sm font-semibold text-orange-600">{t('home_faq_badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('home_faq_title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home_faq_subtitle', { system_name: settings?.system_name || 'StockRevive' })}
          </p>
        </div>

        {/* FAQ Accordion */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <i className="ri-loader-4-line animate-spin text-3xl text-orange-500"></i>
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {t('home_faq_no_data')}
          </div>
        ) : (
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
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openIndex === index
                      ? 'bg-gradient-to-br from-orange-500 to-amber-600'
                      : 'bg-gray-100'
                      }`}>
                      <i className={`${faq.icon || 'ri-question-line'} text-2xl ${openIndex === index ? 'text-white' : 'text-gray-600'
                        }`}></i>
                    </div>
                    <h3 className={`text-lg font-bold transition-colors ${openIndex === index ? 'text-orange-600' : 'text-gray-900'
                      }`}>
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openIndex === index
                    ? 'bg-orange-100 rotate-180'
                    : 'bg-gray-100'
                    }`}>
                    <i className={`ri-arrow-down-s-line text-xl ${openIndex === index ? 'text-orange-600' : 'text-gray-600'
                      }`}></i>
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${openIndex === index
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
        )}
      </div>
    </section>
  );
}