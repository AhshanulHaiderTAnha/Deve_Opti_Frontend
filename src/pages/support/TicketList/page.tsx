import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import DashboardNav from '../../dashboard/components/DashboardNav';
import { supportService } from '../../../services/support';
import { useToast } from '../../../hooks/useToast';
import CreateTicketModal from '../components/CreateTicketModal';
import { StatsCardSkeleton } from '../../../components/base/LoadingSkeleton';

interface Ticket {
  id: number;
  ticket_id: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'closed' | 'pending';
  last_reply_at: string;
  messages_count: number;
}

export default function SupportTicketList() {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const fetchTickets = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await supportService.listTickets(page);
      if (res.status === 'success') {
        setTickets(res.data.data);
        setTotalPages(Math.ceil(res.data.total / 10)); // Assuming 10 per page
        setCurrentPage(res.data.current_page);
      } else {
        showError(res.message || 'Failed to load tickets');
      }
    } catch (error) {
      showError('An error occurred while fetching tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(currentPage);
  }, [currentPage]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'closed': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      case 'pending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return t('support_status_open');
      case 'closed': return t('support_status_closed');
      case 'pending': return t('support_status_pending');
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-orange-400';
      case 'low': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return t('support_priority_high');
      case 'medium': return t('support_priority_medium');
      case 'low': return t('support_priority_low');
      default: return t('support_priority_default');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      <DashboardNav />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-24 md:pt-10">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('support_page_title')}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">{t('support_page_desc')}</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition-all active:scale-95 group cursor-pointer"
              >
                <i className="ri-add-line text-lg group-hover:rotate-90 transition-transform"></i>
                <span>{t('support_btn_create')}</span>
              </button>
            </div>

            {/* Tickets Table/List */}
            <div className="bg-white/70 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-gray-800 shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('support_table_info')}</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('support_table_cat')}</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('support_table_pri')}</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('support_table_status')}</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('support_table_activity')}</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">{t('support_table_action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800/50">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="h-10 bg-slate-100 dark:bg-gray-800 rounded-lg"></div>
                          </td>
                        </tr>
                      ))
                    ) : tickets.length > 0 ? (
                      tickets.map(ticket => (
                        <tr key={ticket.id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{ticket.subject}</span>
                              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{t('support_id_prefix')} {ticket.ticket_id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-600 dark:text-slate-400">{ticket.category}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${ticket.priority === 'high' ? 'bg-red-500' : ticket.priority === 'medium' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                              <span className={`text-xs font-bold uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                                {getPriorityLabel(ticket.priority)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>
                              {getStatusLabel(ticket.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col text-[11px]">
                              <span className="text-slate-500 dark:text-slate-400">
                                {new Date(ticket.last_reply_at).toLocaleDateString()}
                              </span>
                              <span className="text-slate-400 dark:text-slate-500">
                                {new Date(ticket.last_reply_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => navigate(`/support-tickets/${ticket.ticket_id}`)}
                              className="inline-flex items-center space-x-1.5 text-orange-600 dark:text-orange-400 font-bold text-sm hover:underline cursor-pointer"
                            >
                              <span>{t('support_btn_view')}</span>
                              <i className="ri-arrow-right-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                          <i className="ri-inbox-line text-4xl mb-2 block opacity-20"></i>
                          <span>{t('support_no_tickets')}</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between bg-slate-50/50 dark:bg-gray-800/30">
                  <p className="text-xs text-slate-500 font-medium">
                    {t('activity_page_of', { current: currentPage, total: totalPages })}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={currentPage === 1 || isLoading}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="p-2 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer"
                    >
                      <i className="ri-arrow-left-s-line"></i>
                    </button>
                    <button
                      disabled={currentPage === totalPages || isLoading}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="p-2 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer"
                    >
                      <i className="ri-arrow-right-s-line"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showCreateModal && (
        <CreateTicketModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchTickets(1);
          }}
        />
      )}
    </div>
  );
}
