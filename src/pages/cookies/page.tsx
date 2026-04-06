import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function CookiesPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'what-are-cookies', title: 'What are Cookies?' },
    { id: 'how-we-use', title: 'How We Use Cookies' },
    { id: 'types-of-cookies', title: 'Types of Cookies We Use' },
    { id: 'your-choices', title: 'Your Choices' },
    { id: 'updates', title: 'Policy Updates' },
    { id: 'contact', title: 'Contact Us' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 font-['Inter',sans-serif]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-orange-600 transition-all font-semibold">
            <i className="ri-arrow-left-line text-xl"></i>
            <span>Back to Home</span>
          </Link>
          <div className="text-sm text-gray-500 font-medium tracking-tight">Last Updated: April 2024</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6 text-xs uppercase tracking-[0.2em]">Table of Contents</h3>
              <nav className="space-y-1.5">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-300 transform ${
                      activeSection === section.id
                        ? 'bg-orange-500 text-white font-bold shadow-lg shadow-orange-200 translate-x-2'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 p-8 lg:p-16 shadow-xl shadow-gray-200/50">
            <div className="max-w-3xl">
              <div className="mb-12">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Cookie Policy</h1>
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  We use cookies to enhance your experience, analyze site traffic, and serve better advertising. This policy outlines exactly what technologies we use and why.
                </p>
              </div>

              {/* Section 1 */}
              <section id="introduction" className="mb-16 scroll-mt-28">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0">1</span>
                  Introduction
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed text-base">
                  <p>
                    Welcome to our Cookie Policy. When you visit our website, we use cookies and similar tracking technologies to collect information about your interaction with our services.
                  </p>
                  <p>
                    This policy is designed to help you understand what cookies are, how we use them, and your choices regarding their use. By continuing to browse our site, you agree to our use of cookies as described here.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="what-are-cookies" className="mb-16 scroll-mt-28">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0">2</span>
                  What are Cookies?
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed text-base">
                  <p>
                    Cookies are small text files that are stored on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
                  </p>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 italic text-slate-500 text-sm">
                    "Think of cookies as a website's memory. They help the site remember who you are and your preferences for your next visit."
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="how-we-use" className="mb-16 scroll-mt-28">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0">3</span>
                  How We Use Cookies
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed text-base">
                  <p>We use cookies for several critical purposes:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: 'ri-user-smile-line', title: 'Personalization', desc: 'Remembering your language and theme preferences.' },
                      { icon: 'ri-shield-user-line', title: 'Authentication', desc: 'Keeping you logged in across different sessions.' },
                      { icon: 'ri-bar-chart-box-line', title: 'Analytics', desc: 'Understanding how you use our platform to improve it.' },
                      { icon: 'ri-advertisement-line', title: 'Advertising', desc: 'Showing you relevant offers and promotions.' }
                    ].map((item, i) => (
                      <li key={i} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all duration-300">
                        <i className={`${item.icon} text-orange-500 text-2xl mb-3 block`}></i>
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-sm opacity-80">{item.desc}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section id="types-of-cookies" className="mb-16 scroll-mt-28">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0">4</span>
                  Types of Cookies We Use
                </h2>
                <div className="space-y-8">
                  {[
                    { type: 'Essential Cookies', detail: 'These are necessary for the website to function and cannot be switched off in our systems.' },
                    { type: 'Performance Cookies', detail: 'These allow us to count visits and traffic sources so we can measure and improve the performance of our site.' },
                    { type: 'Functional Cookies', detail: 'These enable the website to provide enhanced functionality and personalization.' },
                    { type: 'Targeting Cookies', detail: 'These may be set through our site by our advertising partners to build a profile of your interests.' }
                  ].map((item, i) => (
                    <div key={i} className="relative pl-8 border-l-2 border-orange-200 group">
                      <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-orange-400 group-hover:scale-150 transition-transform"></div>
                      <h4 className="font-bold text-gray-900 mb-2">{item.type}</h4>
                      <p className="text-gray-600 text-sm">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 5 */}
              <section id="your-choices" className="mb-16 scroll-mt-28">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0">5</span>
                  Your Choices
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed text-base">
                  <p>
                    You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to refuse cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
                  </p>
                  <p>
                    Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" className="text-orange-600 hover:underline font-bold" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a>.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section id="updates" className="mb-16 scroll-mt-28">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0">6</span>
                  Policy Updates
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed text-base">
                  <p>
                    We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons.
                  </p>
                  <p>
                    Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies. The date at the top of this Cookie Policy indicates when it was last updated.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="contact" className="mb-16 scroll-mt-28">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-4">
                  <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0">7</span>
                  Contact Us
                </h2>
                <div className="bg-orange-50 rounded-3xl p-8 border border-orange-100">
                  <p className="text-gray-700 mb-6 font-medium">
                    If you have any questions about our use of cookies or other technologies, please email us or reach out via our support channel:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="mailto:support@stackrevive.com" className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all font-bold text-gray-900 border border-gray-100">
                      <i className="ri-mail-send-line text-orange-500"></i>
                      support@stackrevive.com
                    </a>
                    <Link to="/support-tickets" className="flex items-center gap-3 bg-orange-500 px-6 py-3 rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all font-bold text-white">
                      <i className="ri-customer-service-line"></i>
                      Open Support Ticket
                    </Link>
                  </div>
                </div>
              </section>

              {/* Final Footer Info */}
              <div className="pt-12 border-t border-gray-100">
                <p className="text-center text-gray-400 text-sm font-medium">
                  © {new Date().getFullYear()} StackRevive. All rights reserved.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
