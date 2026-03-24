import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component protects routes that require authentication.
 * If no token is found in localStorage, it redirects to the login page.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect to login page but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
