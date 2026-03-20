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
    element: <DashboardPage />,
  },
  {
    path: '/orders',
    element: <OrdersPage />,
  },
  {
    path: '/wallet',
    element: <WalletPage />,
  },
  {
    path: '/analytics',
    element: <AnalyticsPage />,
  },
  {
    path: '/promotions',
    element: <PromotionsPage />,
  },
  {
    path: '/announcements',
    element: <AnnouncementsPage />,
  },
  {
    path: '/activity-logs',
    element: <ActivityLogsPage />,
  },
  {
    path: '/account',
    element: <AccountPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/support-tickets',
    element: <SupportTicketList />,
  },
  {
    path: '/support-tickets/:ticketId',
    element: <SupportTicketDetails />,
  },
  {
    path: '/deposit-card',
    element: <DepositCardPage />,
  },
  {
    path: '/deposit-bank',
    element: <DepositBankPage />,
  },
  {
    path: '/deposit-ewallet',
    element: <DepositEwalletPage />,
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
    element: <DepositRequestsPage />,
  },
  {
    path: '/withdraw-requests',
    element: <WithdrawRequestsPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default routes;
