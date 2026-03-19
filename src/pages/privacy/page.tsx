import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'collection', title: 'Information We Collect' },
    { id: 'usage', title: 'How We Use Your Information' },
    { id: 'sharing', title: 'Information Sharing' },
    { id: 'cookies', title: 'Cookies & Tracking' },
    { id: 'security', title: 'Data Security' },
    { id: 'retention', title: 'Data Retention' },
    { id: 'rights', title: 'Your Privacy Rights' },
    { id: 'children', title: 'Children\'s Privacy' },
    { id: 'international', title: 'International Transfers' },
    { id: 'updates', title: 'Policy Updates' },
    { id: 'contact', title: 'Contact Us' },
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
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
              <p className="text-gray-600 mb-8">
                Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>

              {/* Section 1 */}
              <section id="introduction" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  Introduction
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    This Privacy Policy describes how we collect, use, process, and disclose your information, including personal information, in conjunction with your access to and use of our platform and services.
                  </p>
                  <p>
                    By accessing or using our services, you acknowledge that you have read and understood this Privacy Policy and our Terms of Service. If you do not agree with our policies and practices, please do not use our services.
                  </p>
                  <p>
                    We are committed to protecting your privacy and ensuring the security of your personal information. This policy is designed to help you understand what information we collect, why we collect it, and how you can manage your information.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="collection" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  Information We Collect
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>We collect several types of information from and about users of our platform:</p>
                  
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Full name, email address, and phone number</li>
                        <li>Account credentials (username and encrypted password)</li>
                        <li>Profile information and avatar images</li>
                        <li>Payment information and wallet details</li>
                        <li>Identity verification documents (KYC)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Order history and transaction records</li>
                        <li>Commission earnings and withdrawal history</li>
                        <li>Referral activity and network data</li>
                        <li>Platform interaction and feature usage</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Technical Information</h3>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>IP address, browser type, and device information</li>
                        <li>Operating system and screen resolution</li>
                        <li>Cookies and similar tracking technologies</li>
                        <li>Log data including access times and pages viewed</li>
                      </ul>
                    </div>
                  </div>

                  <p>
                    We collect this information when you provide it directly to us, automatically through your use of our services, or from third-party sources such as social media platforms when you choose to connect your accounts.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section id="usage" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  How We Use Your Information
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>We use the information we collect for various purposes, including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Providing, maintaining, and improving our services</li>
                    <li>Processing transactions and managing your account</li>
                    <li>Calculating and distributing commissions and rewards</li>
                    <li>Verifying your identity and preventing fraud</li>
                    <li>Sending you important notifications and updates</li>
                    <li>Responding to your inquiries and providing customer support</li>
                    <li>Analyzing usage patterns to enhance user experience</li>
                    <li>Enforcing our Terms of Service and protecting our rights</li>
                    <li>Complying with legal obligations and regulatory requirements</li>
                    <li>Marketing and promotional communications (with your consent)</li>
                  </ul>
                  <p>
                    We process your personal information based on legitimate interests, contractual necessity, legal obligations, and your consent where required by law.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section id="sharing" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                  Information Sharing
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Service Providers:</strong> We share information with trusted third-party service providers who assist us in operating our platform, processing payments, and providing customer support</li>
                    <li><strong>Legal Requirements:</strong> We may disclose information when required by law, court order, or government request</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity</li>
                    <li><strong>Fraud Prevention:</strong> We may share information with fraud detection services and law enforcement to protect against fraudulent activities</li>
                    <li><strong>With Your Consent:</strong> We may share information with third parties when you explicitly consent to such sharing</li>
                  </ul>
                  <p>
                    All third parties with whom we share your information are required to maintain the confidentiality and security of your data and are prohibited from using it for any purpose other than providing services to us.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section id="cookies" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                  Cookies & Tracking Technologies
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We use cookies and similar tracking technologies to collect and track information about your use of our platform. Cookies are small data files stored on your device that help us improve your experience.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Essential Cookies</h3>
                      <p className="text-sm">Required for the platform to function properly, including authentication and security features</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Performance Cookies</h3>
                      <p className="text-sm">Help us understand how users interact with our platform to improve functionality</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Functional Cookies</h3>
                      <p className="text-sm">Remember your preferences and settings for a personalized experience</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h3>
                      <p className="text-sm">Collect anonymous data about usage patterns and traffic sources</p>
                    </div>
                  </div>

                  <p>
                    You can control cookie preferences through your browser settings. However, disabling certain cookies may limit your ability to use some features of our platform.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section id="security" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
                  Data Security
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Our security measures include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of data in transit using SSL/TLS protocols</li>
                    <li>Encryption of sensitive data at rest</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Employee training on data protection and privacy</li>
                    <li>Incident response procedures for data breaches</li>
                  </ul>
                  <p>
                    While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we continuously work to enhance our security measures.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section id="retention" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">7</span>
                  Data Retention
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Retention periods vary depending on the type of information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Information:</strong> Retained while your account is active and for a reasonable period thereafter</li>
                    <li><strong>Transaction Records:</strong> Retained for at least 7 years for tax and accounting purposes</li>
                    <li><strong>Communication Records:</strong> Retained for 3 years for customer service and dispute resolution</li>
                    <li><strong>Marketing Data:</strong> Retained until you withdraw consent or for 2 years of inactivity</li>
                  </ul>
                  <p>
                    When we no longer need your information, we will securely delete or anonymize it in accordance with our data retention policies and applicable laws.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section id="rights" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">8</span>
                  Your Privacy Rights
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Depending on your location, you may have certain rights regarding your personal information under applicable data protection laws:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Right to Erasure:</strong> Request deletion of your personal information under certain circumstances</li>
                    <li><strong>Right to Restriction:</strong> Request limitation of processing of your information</li>
                    <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
                    <li><strong>Right to Object:</strong> Object to processing of your information for certain purposes</li>
                    <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for processing based on consent</li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact us using the information provided in the Contact Us section. We will respond to your request within the timeframe required by applicable law.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section id="children" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">9</span>
                  Children's Privacy
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18 years of age. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately.
                  </p>
                  <p>
                    If we become aware that we have collected personal information from a child under 18 without verification of parental consent, we will take steps to delete that information from our servers as quickly as possible.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section id="international" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">10</span>
                  International Data Transfers
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Your information may be transferred to and maintained on servers located outside of your country, state, province, or other governmental jurisdiction where data protection laws may differ from those in your jurisdiction.
                  </p>
                  <p>
                    If you are located outside the United States and choose to provide information to us, please note that we transfer the data, including personal information, to the United States and process it there. By using our services, you consent to this transfer and processing.
                  </p>
                  <p>
                    We take appropriate safeguards to ensure that your personal information remains protected in accordance with this Privacy Policy when transferred internationally, including the use of standard contractual clauses approved by relevant authorities.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section id="updates" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">11</span>
                  Policy Updates
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Posting the updated policy on our platform with a new "Last Updated" date</li>
                    <li>Sending you an email notification to the address associated with your account</li>
                    <li>Displaying a prominent notice on our platform</li>
                  </ul>
                  <p>
                    We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information. Your continued use of our services after any changes indicates your acceptance of the updated policy.
                  </p>
                </div>
              </section>

              {/* Section 12 */}
              <section id="contact" className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">12</span>
                  Contact Us
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Data Protection Officer:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <i className="ri-mail-line text-orange-600 text-xl w-6 h-6 flex items-center justify-center"></i>
                      <span>privacy@platform.com</span>
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
                    We are committed to resolving any privacy concerns you may have. We will investigate and attempt to resolve complaints and disputes in accordance with the principles contained in this Privacy Policy.
                  </p>
                </div>
              </section>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  This Privacy Policy was last updated on January 2025. Please review it regularly to stay informed about our privacy practices.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}