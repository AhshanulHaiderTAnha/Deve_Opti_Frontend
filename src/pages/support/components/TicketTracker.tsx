import { useState, useEffect } from 'react';

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  lastUpdate: Date;
}

export default function TicketTracker() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Load mock tickets
    const mockTickets: Ticket[] = [
      {
        id: 'TKT-2847',
        subject: 'Withdrawal not received',
        status: 'in-progress',
        priority: 'high',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastUpdate: new Date(Date.now() - 5 * 60 * 60 * 1000)
      },
      {
        id: 'TKT-2801',
        subject: 'Account verification issue',
        status: 'resolved',
        priority: 'medium',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        lastUpdate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'TKT-2756',
        subject: 'Referral bonus not credited',
        status: 'resolved',
        priority: 'low',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        lastUpdate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ];
    setTickets(mockTickets);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'resolved':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (tickets.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <i className="ri-ticket-line text-xl text-purple-600 w-5 h-5 flex items-center justify-center"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Support Tickets</h2>
            <p className="text-sm text-gray-600">Track the status of your support requests</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium whitespace-nowrap">
          {tickets.filter(t => t.status !== 'resolved').length} Active
        </span>
      </div>

      <div className="space-y-3">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-sm font-semibold text-gray-900">
                    {ticket.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{ticket.subject}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <i className="ri-flag-line w-4 h-4 flex items-center justify-center"></i>
                    <span className={`capitalize ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="ri-time-line w-4 h-4 flex items-center justify-center"></i>
                    <span>Created {formatDate(ticket.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <i className="ri-refresh-line w-4 h-4 flex items-center justify-center"></i>
                    <span>Updated {formatDate(ticket.lastUpdate)}</span>
                  </div>
                </div>
              </div>
              <button className="ml-4 px-4 py-2 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}