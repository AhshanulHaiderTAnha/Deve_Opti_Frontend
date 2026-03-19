import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({ subject: '', message: '', email: '' });

    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <i className="ri-mail-send-line text-xl text-orange-600 w-5 h-5 flex items-center justify-center"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Contact Support</h2>
          <p className="text-sm text-gray-600">Send us a message and we'll get back to you soon</p>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <i className="ri-check-line text-white text-sm w-3 h-3 flex items-center justify-center"></i>
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Message Sent Successfully!</h4>
            <p className="text-sm text-green-700">We've received your message and will respond within 24 hours.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm cursor-pointer"
          >
            <option value="">Select a subject</option>
            <option value="account">Account Issues</option>
            <option value="payment">Payment & Withdrawal</option>
            <option value="orders">Order Problems</option>
            <option value="referral">Referral Program</option>
            <option value="technical">Technical Support</option>
            <option value="verification">Account Verification</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message
          </label>
          <textarea
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={6}
            maxLength={500}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm resize-none"
            placeholder="Describe your issue in detail..."
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">Please provide as much detail as possible</p>
            <p className="text-xs text-gray-500">{formData.message.length}/500</p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <i className="ri-send-plane-fill w-5 h-5 flex items-center justify-center"></i>
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}