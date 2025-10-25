import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useRBAC } from '../contexts/RBACContext';
import { Permission, type UserRole } from '../utils/permissions';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions; if false, ANY permission
  allowedRoles?: UserRole[];
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * ProtectedRoute component that checks user permissions before rendering children
 * Can be used to protect entire routes or specific UI elements
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  allowedRoles,
  fallback,
  redirectTo = '/firm',
}) => {
  const { userInfo, loading, hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();

  // Show loading state
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  // Not authenticated
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to={redirectTo} replace />;
  }

  // Check multiple permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return <Navigate to={redirectTo} replace />;
    }
  }

  // User has access, render children
  return <>{children}</>;
};

interface ProtectedElementProps {
  children: ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  allowedRoles?: UserRole[];
  fallback?: ReactNode;
  hide?: boolean; // If true, hide completely; if false, show fallback
}

/**
 * ProtectedElement component for conditionally rendering UI elements based on permissions
 * Does not redirect, just shows/hides elements
 */
export const ProtectedElement: React.FC<ProtectedElementProps> = ({
  children,
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  allowedRoles,
  fallback = null,
  hide = true,
}) => {
  const { userInfo, loading, hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Not authenticated
  if (!userInfo) {
    return hide ? null : <>{fallback}</>;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    return hide ? null : <>{fallback}</>;
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return hide ? null : <>{fallback}</>;
  }

  // Check multiple permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      return hide ? null : <>{fallback}</>;
    }
  }

  // User has access, render children
  return <>{children}</>;
};

/**
 * Hook to check if current user has access based on permissions/roles
 */
export const useHasAccess = (
  requiredPermission?: Permission,
  requiredPermissions?: Permission[],
  requireAll: boolean = false,
  allowedRoles?: UserRole[]
): boolean => {
  const { userInfo, hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();

  if (!userInfo) return false;

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(userInfo.role)) {
    return false;
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return false;
  }

  // Check multiple permissions
  if (requiredPermissions && requiredPermissions.length > 0) {
    return requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  }

  return true;
};

// Styled components for loading state
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
`;

export default ProtectedRoute;
