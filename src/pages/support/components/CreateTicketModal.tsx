import { useState, useRef } from 'react';
import { supportService } from '../../../services/support';
import { useToast } from '../../../hooks/useToast';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTicketModal({ isOpen, onClose, onSuccess }: CreateTicketModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'Billing',
    priority: 'medium',
    message: '',
  });
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: showError } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
      }
      setAttachment(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const body = new FormData();
    body.append('subject', formData.subject);
    body.append('category', formData.category);
    body.append('priority', formData.priority);
    body.append('message', formData.message);
    if (attachment) {
      body.append('attachment', attachment);
    }

    try {
      const res = await supportService.createTicket(body);
      if (res.status === 'success') {
        success('Ticket created successfully');
        onSuccess();
      } else {
        showError(res.message || 'Failed to create ticket');
      }
    } catch (error) {
      showError('An error occurred while creating the ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-950 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between bg-slate-50/50 dark:bg-gray-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-600">
              <i className="ri-customer-service-2-line text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">New Support Ticket</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Describe your issue for better assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors pointer-events-auto cursor-pointer"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of the issue"
                className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none cursor-pointer"
                >
                  <option value="Billing">Billing</option>
                  <option value="Technical">Technical</option>
                  <option value="Account">Account</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Explain your problem in detail..."
                className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Attachment (Optional)</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-slate-50 dark:bg-gray-900 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl px-4 py-4 text-center cursor-pointer hover:border-orange-500/50 transition-all group"
              >
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                />
                <i className={`ri-attachment-2 text-2xl block mb-1 ${attachment ? 'text-orange-500' : 'text-slate-400 group-hover:text-orange-400'}`}></i>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {attachment ? attachment.name : 'Click to upload screenshot or file (Max 5MB)'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-200 dark:border-gray-800 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all cursor-pointer whitespace-nowrap"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/25 disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-lg"></i>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Submit Ticket</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
