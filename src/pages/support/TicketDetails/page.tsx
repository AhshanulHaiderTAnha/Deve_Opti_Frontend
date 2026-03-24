import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardNav from '../../dashboard/components/DashboardNav';
import { supportService } from '../../../services/support';
import { useToast } from '../../../hooks/useToast';

interface Message {
  id: number;
  message: string;
  attachment_url: string | null;
  is_admin_reply: boolean;
  user: { name: string; id: number };
}

interface TicketDetails {
  id: number;
  ticket_id: string;
  subject: string;
  status: string;
  messages: Message[];
}

export default function TicketDetails() {
  const { t } = useTranslation();
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const fetchDetails = async () => {
    if (!ticketId) return;
    setIsLoading(true);
    try {
      const res = await supportService.getTicketDetails(ticketId);
      if (res.status === 'success') {
        setTicket(res.data);
      } else {
        showError(res.message || t('support_details_err_fetch'));
      }
    } catch (error) {
      showError(t('support_details_err_fetch'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !ticketId || isReplying) return;

    setIsReplying(true);
    const body = new FormData();
    body.append('message', replyMessage);
    if (attachment) {
      body.append('attachment', attachment);
    }

    try {
      const res = await supportService.replyToTicket(ticketId, body);
      if (res.status === 'success') {
        success(t('support_reply_success'));
        setReplyMessage('');
        setAttachment(null);
        fetchDetails(); // Refresh messages
      } else {
        showError(res.message || t('support_reply_err'));
      }
    } catch (error) {
      showError(t('support_reply_err_occured'));
    } finally {
      setIsReplying(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showError(t('support_file_size_err'));
        return;
      }
      setAttachment(file);
    }
  };

  if (isLoading && !ticket) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
        <DashboardNav />
        <div className="lg:ml-64 flex flex-col min-h-screen items-center justify-center">
          <i className="ri-loader-4-line text-4xl text-orange-500 animate-spin"></i>
        </div>
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <DashboardNav />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-24 md:pt-10">
          <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-180px)]">

            {/* Ticket Header */}
            <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-gray-800 shadow-xl p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate('/support-tickets')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl text-slate-500 dark:text-slate-400 cursor-pointer"
                  >
                    <i className="ri-arrow-left-line text-xl"></i>
                  </button>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">{ticket.subject}</h1>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          'bg-slate-500/10 text-slate-500 border-slate-500/20'
                        }`}>
                        {ticket.status === 'open' ? t('support_status_open') : t('support_status_closed')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{t('support_ticket_id_prefix')} {ticket.ticket_id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-6 px-2 mb-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-gray-800">
              {ticket.messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.is_admin_reply ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[70%] space-y-1 ${msg.is_admin_reply ? 'order-2' : ''}`}>
                    <div className={`flex items-center space-x-2 mb-1 ${msg.is_admin_reply ? 'justify-start' : 'justify-end'}`}>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {msg.is_admin_reply ? t('support_team') : t('support_you')}
                      </span>
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm border ${msg.is_admin_reply
                        ? 'bg-white dark:bg-gray-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-gray-700 rounded-tl-none'
                        : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white border-orange-600/20 rounded-tr-none'
                      }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      {msg.attachment_url && (
                        <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5">
                          <a
                            href={msg.attachment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center space-x-2 text-xs font-bold py-1.5 px-3 rounded-lg transition-all ${msg.is_admin_reply ? 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-400' : 'bg-white/20 text-white'
                              }`}
                          >
                            <i className="ri-attachment-2"></i>
                            <span>{t('support_view_attachment')}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input */}
            <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-gray-800 shadow-xl p-3">
              <form onSubmit={handleReply} className="relative flex flex-col">
                <textarea
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  placeholder={t('support_placeholder_reply')}
                  className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-800 dark:text-slate-200 px-3 py-2 min-h-[80px] resize-none pb-12 outline-none"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReply(e as any);
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-auto px-2 py-1 border-t border-slate-100 dark:border-gray-800/50 pt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${attachment ? 'bg-orange-500/10 text-orange-500' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800'}`}
                      title={t('support_attach_file')}
                    >
                      <i className="ri-attachment-2 text-lg"></i>
                      <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                      />
                    </button>
                    {attachment && (
                      <span className="text-[10px] text-slate-500 font-bold truncate max-w-[120px]">
                        {attachment.name}
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!replyMessage.trim() || isReplying}
                    className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white py-2 px-5 rounded-xl font-bold text-xs shadow-lg shadow-orange-600/20 disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
                  >
                    {isReplying ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-send-plane-2-fill"></i>}
                    <span>{t('support_btn_send')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
