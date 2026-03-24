import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/home/page'));
const LoginPage = lazy(() => import('../pages/login/page'));
const SignupPage = lazy(() => import('../pages/signup/page'));
const ForgotPasswordPage = lazy(() => import('../pages/forgot-password/page'));
const VerifyEmailPage = lazy(() => import('../pages/verify-email/page'));
const DashboardPage = lazy(() => import('../pages/dashboard/page'));
const OrdersPage = lazy(() => import('../pages/orders/page'));
const WalletPage = lazy(() => import('../pages/wallet/page'));
const AnalyticsPage = lazy(() => import('../pages/analytics/page'));
const PromotionsPage = lazy(() => import('../pages/promotions/page'));
const AccountPage = lazy(() => import('../pages/account/page'));
const SettingsPage = lazy(() => import('../pages/settings/page'));
const AnnouncementsPage = lazy(() => import('../pages/notifications/page'));
const ActivityLogsPage = lazy(() => import('../pages/activity-logs/page'));
const SupportTicketList = lazy(() => import('../pages/support/TicketList/page'));
const SupportTicketDetails = lazy(() => import('../pages/support/TicketDetails/page'));
const TermsPage = lazy(() => import('../pages/terms/page'));
const PrivacyPage = lazy(() => import('../pages/privacy/page'));
const DepositBankPage = lazy(() => import('../pages/deposit-bank/page'));
const DepositCardPage = lazy(() => import('../pages/deposit-card/page'));
const DepositEwalletPage = lazy(() => import('../pages/deposit-ewallet/page'));
const DepositRequestsPage = lazy(() => import('../pages/deposit-requests/page'));
const WithdrawRequestsPage = lazy(() => import('../pages/withdraw-requests/page'));
const NotFoundPage = lazy(() => import('../pages/NotFound'));

import AuthGuard from '../components/base/AuthGuard';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <DashboardPage />
      </AuthGuard>
    ),
  },
  {
    path: '/orders',
    element: (
      <AuthGuard>
        <OrdersPage />
      </AuthGuard>
    ),
  },
  {
    path: '/wallet',
    element: (
      <AuthGuard>
        <WalletPage />
      </AuthGuard>
    ),
  },
  {
    path: '/analytics',
    element: (
      <AuthGuard>
        <AnalyticsPage />
      </AuthGuard>
    ),
  },
  {
    path: '/promotions',
    element: (
      <AuthGuard>
        <PromotionsPage />
      </AuthGuard>
    ),
  },
  {
    path: '/announcements',
    element: (
      <AuthGuard>
        <AnnouncementsPage />
      </AuthGuard>
    ),
  },
  {
    path: '/activity-logs',
    element: (
      <AuthGuard>
        <ActivityLogsPage />
      </AuthGuard>
    ),
  },
  {
    path: '/account',
    element: (
      <AuthGuard>
        <AccountPage />
      </AuthGuard>
    ),
  },
  {
    path: '/settings',
    element: (
      <AuthGuard>
        <SettingsPage />
      </AuthGuard>
    ),
  },
  {
    path: '/support-tickets',
    element: (
      <AuthGuard>
        <SupportTicketList />
      </AuthGuard>
    ),
  },
  {
    path: '/support-tickets/:ticketId',
    element: (
      <AuthGuard>
        <SupportTicketDetails />
      </AuthGuard>
    ),
  },
  {
    path: '/deposit-card',
    element: (
      <AuthGuard>
        <DepositCardPage />
      </AuthGuard>
    ),
  },
  {
    path: '/deposit-bank',
    element: (
      <AuthGuard>
        <DepositBankPage />
      </AuthGuard>
    ),
  },
  {
    path: '/deposit-ewallet',
    element: (
      <AuthGuard>
        <DepositEwalletPage />
      </AuthGuard>
    ),
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/deposit-requests',
    element: (
      <AuthGuard>
        <DepositRequestsPage />
      </AuthGuard>
    ),
  },
  {
    path: '/withdraw-requests',
    element: (
      <AuthGuard>
        <WithdrawRequestsPage />
      </AuthGuard>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
