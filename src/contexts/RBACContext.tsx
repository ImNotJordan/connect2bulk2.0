import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { 
  type UserRole, 
  Permission, 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  isAdmin,
  isOperationsStaff,
  canManageUsers
} from '../utils/permissions';

interface UserInfo {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  firmId?: string;
}

interface RBACContextType {
  userInfo: UserInfo | null;
  loading: boolean;
  error: string | null;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  isAdmin: () => boolean;
  isOperationsStaff: () => boolean;
  canManageUsers: () => boolean;
  refreshUserInfo: () => Promise<void>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

interface RBACProviderProps {
  children: ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user from Cognito
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      if (!currentUser || !session.tokens) {
        throw new Error('Not authenticated');
      }

      const userId = currentUser.userId;
      const email = currentUser.signInDetails?.loginId || '';

      // Get user attributes from Cognito token
      const idToken = session.tokens.idToken;
      const role = idToken?.payload['custom:role'] as UserRole || 'READ_ONLY';
      const firstName = idToken?.payload['given_name'] as string;
      const lastName = idToken?.payload['family_name'] as string;
      const firmId = idToken?.payload['custom:firm_id'] as string;

      // Alternatively, fetch from User table in database
      const client = generateClient<Schema>({ authMode: 'userPool' } as any);
      
      try {
        const userResponse = await client.models.User.list({
          filter: { email: { eq: email } }
        });

        if (userResponse.data && userResponse.data.length > 0) {
          const dbUser = userResponse.data[0];
          
          setUserInfo({
            userId,
            email,
            firstName: dbUser.first_name || firstName,
            lastName: dbUser.last_name || lastName,
            role: (dbUser.role as UserRole) || role,
            firmId: dbUser.firm_id || firmId,
          });
        } else {
          // Fallback to token data if user not in database yet
          setUserInfo({
            userId,
            email,
            firstName,
            lastName,
            role,
            firmId,
          });
        }
      } catch (dbError) {
        // If database query fails, use token data
        console.warn('Failed to fetch user from database, using token data:', dbError);
        setUserInfo({
          userId,
          email,
          firstName,
          lastName,
          role,
          firmId,
        });
      }
    } catch (err) {
      console.error('Error loading user info:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user information');
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  const contextValue: RBACContextType = {
    userInfo,
    loading,
    error,
    hasPermission: (permission: Permission) => hasPermission(userInfo?.role, permission),
    hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(userInfo?.role, permissions),
    hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(userInfo?.role, permissions),
    isAdmin: () => isAdmin(userInfo?.role),
    isOperationsStaff: () => isOperationsStaff(userInfo?.role),
    canManageUsers: () => canManageUsers(userInfo?.role),
    refreshUserInfo: loadUserInfo,
  };

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
};

// Custom hook to use RBAC context
export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

// Convenience hooks
export const useUserRole = (): UserRole | undefined => {
  const { userInfo } = useRBAC();
  return userInfo?.role;
};

export const useUserInfo = (): UserInfo | null => {
  const { userInfo } = useRBAC();
  return userInfo;
};

export const useHasPermission = (permission: Permission): boolean => {
  const { hasPermission } = useRBAC();
  return hasPermission(permission);
};

export const useHasAnyPermission = (permissions: Permission[]): boolean => {
  const { hasAnyPermission } = useRBAC();
  return hasAnyPermission(permissions);
};

export const useHasAllPermissions = (permissions: Permission[]): boolean => {
  const { hasAllPermissions } = useRBAC();
  return hasAllPermissions(permissions);
};
