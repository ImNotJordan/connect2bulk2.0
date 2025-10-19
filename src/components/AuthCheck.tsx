import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useAlert } from './AlertProvider';

interface AuthCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { info } = useAlert();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await fetchAuthSession();
        const authenticated = Boolean(session?.tokens);
        setIsAuthenticated(authenticated);
        
        if (!authenticated) {
          info({
            title: 'Sign In Required',
            message: 'Please sign in to access this page.',
            position: 'top-right',
            autoClose: true,
            autoCloseDuration: 5000,
          });
          navigate(redirectTo, { replace: true });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        navigate(redirectTo, { replace: true });
      }
    };

    checkAuth();
  }, [navigate, redirectTo, info]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return null; // or return a loading spinner
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default AuthCheck;
