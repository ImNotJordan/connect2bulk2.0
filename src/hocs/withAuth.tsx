import { useEffect, useState } from 'react';
import type { ComponentType, FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useAlert } from '../components/AlertProvider';

function withAuth<P extends object>(WrappedComponent: ComponentType<P>): FC<P> {
  const WithAuth: FC<P> = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { info } = useAlert();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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
            
            navigate('/login', { 
              state: { from: location },
              replace: true 
            });
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
          setIsAuthenticated(false);
          navigate('/login', { 
            state: { from: location },
            replace: true 
          });
        }
      };

      checkAuth();
    }, [navigate, location, info]);

    // Return null while checking auth or if not authenticated (will redirect)
    if (isAuthenticated !== true) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  // Set display name for better debugging
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithAuth.displayName = `withAuth(${displayName})`;

  return WithAuth;
}

export default withAuth;
