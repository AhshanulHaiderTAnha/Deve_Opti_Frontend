import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('acceptance');

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms' },
    { id: 'services', title: 'Services Description' },
    { id: 'registration', title: 'User Registration' },
    { id: 'obligations', title: 'User Obligations' },
    { id: 'payments', title: 'Payments & Commissions' },
    { id: 'intellectual', title: 'Intellectual Property' },
    { id: 'prohibited', title: 'Prohibited Activities' },
    { id: 'termination', title: 'Termination' },
    { id: 'liability', title: 'Limitation of Liability' },
    { id: 'changes', title: 'Changes to Terms' },
    { id: 'contact', title: 'Contact Information' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-orange-600 transition-colors">
            <i className="ri-arrow-left-line text-xl"></i>
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="text-sm text-gray-500">Last Updated: January 2025</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-8">
          {/* Table of Contents Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Table of Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap ${
                      activeSection === section.id
                        ? 'bg-orange-50 text-orange-600 font-semibold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white rounded-lg border border-gray-200 p-8 lg:p-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-gray-600 mb-8">
                Please read these Terms of Service carefully before using our platform. By accessing or using our services, you agree to be bound by these terms.
              </p>

              {/* Section 1 */}
              <section id="acceptance" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  Acceptance of Terms
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    By creating an account, accessing, or using our platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not use our services.
                  </p>
                  <p>
                    These terms constitute a legally binding agreement between you and our company. Your continued use of the platform signifies your acceptance of any modifications to these terms.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="services" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  Services Description
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Our platform provides a commission-based order fulfillment system where users can participate in completing tasks and earning rewards. The services include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access to a dashboard for managing orders and tracking earnings</li>
                    <li>Commission-based reward system with multiple tier levels</li>
                    <li>Wallet management for deposits, withdrawals, and balance tracking</li>
                    <li>Referral program to earn additional commissions</li>
                    <li>Real-time statistics and performance analytics</li>
                  </ul>
                  <p>
                    We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section id="registration" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  User Registration
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    To access our services, you must create an account by providing accurate, complete, and current information. You are responsible for:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us immediately of any unauthorized access or security breach</li>
                    <li>Ensuring you meet the minimum age requirement of 18 years or older</li>
                  </ul>
                  <p>
                    You may not create multiple accounts, share your account with others, or transfer your account without our written permission. We reserve the right to suspend or terminate accounts that violate these terms.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section id="obligations" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                  User Obligations
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>As a user of our platform, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate and truthful information at all times</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Use the platform only for lawful purposes</li>
                    <li>Not engage in any fraudulent, abusive, or harmful activities</li>
                    <li>Not attempt to manipulate or exploit the commission system</li>
                    <li>Not interfere with the proper functioning of the platform</li>
                    <li>Respect the intellectual property rights of others</li>
                  </ul>
                  <p>
                    Failure to comply with these obligations may result in immediate suspension or termination of your account and forfeiture of any pending commissions.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section id="payments" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                  Payments & Commissions
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Our commission structure is based on order completion and tier levels. Commission rates and payment terms are subject to change at our discretion. Key payment terms include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Commissions are calculated based on completed orders and your current tier level</li>
                    <li>Minimum withdrawal amounts and processing times apply</li>
                    <li>Withdrawal fees may be deducted from your balance</li>
                    <li>We reserve the right to withhold payments if fraud or violations are suspected</li>
                    <li>All transactions are processed securely through our payment partners</li>
                    <li>Refunds are handled on a case-by-case basis according to our refund policy</li>
                  </ul>
                  <p>
                    You are responsible for any taxes or fees associated with your earnings. We do not provide tax advice and recommend consulting with a tax professional.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section id="intellectual" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
                  Intellectual Property
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    All content, features, and functionality on our platform, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, data compilations, and software, are the exclusive property of our company or our licensors and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p>
                    You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our platform without our prior written consent.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="prohibited" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">7</span>
                  Prohibited Activities
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>You are expressly prohibited from:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Using automated systems or bots to interact with the platform</li>
                    <li>Attempting to gain unauthorized access to any portion of the platform</li>
                    <li>Engaging in any form of data mining, scraping, or harvesting</li>
                    <li>Uploading viruses, malware, or any malicious code</li>
                    <li>Impersonating another user or entity</li>
                    <li>Harassing, threatening, or abusing other users</li>
                    <li>Manipulating the referral or commission system</li>
                    <li>Creating fake accounts or engaging in fraudulent activities</li>
                  </ul>
                  <p>
                    Violation of these prohibitions may result in immediate termination of your account and potential legal action.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section id="termination" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">8</span>
                  Termination
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We reserve the right to suspend or terminate your account and access to our services at any time, with or without cause, and with or without notice. Grounds for termination include, but are not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Violation of these Terms of Service</li>
                    <li>Fraudulent or illegal activities</li>
                    <li>Abuse of the platform or other users</li>
                    <li>Extended periods of inactivity</li>
                    <li>Request by law enforcement or government agencies</li>
                  </ul>
                  <p>
                    Upon termination, your right to use the platform will immediately cease. We may retain certain information as required by law or for legitimate business purposes. Any pending commissions may be forfeited depending on the reason for termination.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section id="liability" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">9</span>
                  Limitation of Liability
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    To the fullest extent permitted by applicable law, our company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your access to or use of or inability to access or use the platform</li>
                    <li>Any conduct or content of any third party on the platform</li>
                    <li>Any content obtained from the platform</li>
                    <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                  </ul>
                  <p>
                    Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the platform will be uninterrupted, secure, or error-free.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section id="changes" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">10</span>
                  Changes to Terms
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We reserve the right to modify or replace these Terms of Service at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect through email notification or a prominent notice on our platform.
                  </p>
                  <p>
                    What constitutes a material change will be determined at our sole discretion. By continuing to access or use our platform after any revisions become effective, you agree to be bound by the revised terms.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">11</span>
                  Contact Information
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <i className="ri-mail-line text-orange-600 text-xl w-6 h-6 flex items-center justify-center"></i>
                      <span>support@platform.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-phone-line text-orange-600 text-xl w-6 h-6 flex items-center justify-center"></i>
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <i className="ri-map-pin-line text-orange-600 text-xl w-6 h-6 flex items-center justify-center"></i>
                      <span>123 Business Street, Suite 100, City, State 12345</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-6">
                    We aim to respond to all inquiries within 2-3 business days. For urgent matters, please indicate "URGENT" in your subject line.
                  </p>
                </div>
              </section>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  By using our platform, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}