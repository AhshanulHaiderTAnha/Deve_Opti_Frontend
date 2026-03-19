import { useState } from 'react';
import DashboardNav from '../dashboard/components/DashboardNav';
import ContactForm from './components/ContactForm';
import FAQAccordion from './components/FAQAccordion';
import LiveChatWidget from './components/LiveChatWidget';
import TicketTracker from './components/TicketTracker';
import BackToTop from '../../components/base/BackToTop';

export default function SupportPage() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardNav />

      {showChat && <LiveChatWidget onClose={() => setShowChat(false)} />}

      <div className="lg:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
            <p className="text-gray-600">Get help with your account, orders, and more</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => setShowChat(true)}
              className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <i className="ri-message-3-line text-2xl text-orange-600 w-6 h-6 flex items-center justify-center"></i>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
                <p className="text-sm text-gray-600">Chat with support</p>
              </div>
            </button>

            <a
              href="mailto:support@promoearn.com"
              className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <i className="ri-mail-line text-2xl text-blue-600 w-6 h-6 flex items-center justify-center"></i>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Email Us</h3>
                <p className="text-sm text-gray-600">support@promoearn.com</p>
              </div>
            </a>

            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-2xl text-green-600 w-6 h-6 flex items-center justify-center"></i>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Response Time</h3>
                <p className="text-sm text-gray-600">Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Support Tickets */}
          <TicketTracker />

          {/* Contact Form */}
          <ContactForm />

          {/* FAQ Section */}
          <FAQAccordion />
        </div>
      </div>

      <BackToTop />
    </div>
  );
}