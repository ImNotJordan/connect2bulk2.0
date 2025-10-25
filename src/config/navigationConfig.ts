import { Permission, type UserRole } from '../utils/permissions';

export interface NavItem {
  path: string;
  label: string;
  icon?: string;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  allowedRoles?: UserRole[];
  children?: NavItem[];
}

/**
 * Navigation configuration with role-based access control
 * Each nav item can specify required permissions or roles
 */
export const navigationConfig: NavItem[] = [
  {
    path: '/firm',
    label: 'Dashboard',
    icon: 'dashboard',
    // Everyone can see dashboard
  },
  {
    path: '/firm/load-board',
    label: 'Load Board',
    icon: 'load',
    requiredPermission: Permission.VIEW_LOADS,
  },
  {
    path: '/firm/truck-board',
    label: 'Truck Board',
    icon: 'truck',
    requiredPermission: Permission.VIEW_TRUCKS,
  },
  {
    path: '/firm/search',
    label: 'Search',
    icon: 'search',
    requiredPermission: Permission.USE_GLOBAL_SEARCH,
  },
  {
    path: '/firm/quotes',
    label: 'Quotes',
    icon: 'quote',
    requiredPermission: Permission.VIEW_QUOTES,
  },
  {
    path: '/firm/rfps',
    label: 'RFPs',
    icon: 'rfp',
    requiredPermissions: [Permission.IMPORT_RFP, Permission.VIEW_QUOTES],
    requireAll: false, // User needs at least one of these permissions
  },
  {
    path: '/firm/tracking',
    label: 'Tracking',
    icon: 'tracking',
    requiredPermission: Permission.TRACK_LOADS,
  },
  {
    path: '/firm/communications',
    label: 'Communications',
    icon: 'communication',
    requiredPermission: Permission.VIEW_COMMUNICATIONS,
  },
  {
    path: '/firm/accounting',
    label: 'Accounting',
    icon: 'accounting',
    requiredPermissions: [Permission.VIEW_INVOICES, Permission.VIEW_FINANCIAL_REPORTS],
    requireAll: false,
  },
  {
    path: '/firm/crm',
    label: 'CRM',
    icon: 'crm',
    requiredPermission: Permission.VIEW_CRM,
  },
  {
    path: '/firm/analytics',
    label: 'Analytics',
    icon: 'analytics',
    requiredPermission: Permission.VIEW_ANALYTICS,
  },
  {
    path: '/firm/carriers-brokers',
    label: 'Carriers/Brokers',
    icon: 'carriers',
    allowedRoles: ['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER', 'BROKER'],
  },
  {
    path: '/firm/risk-models',
    label: 'Risk Models',
    icon: 'risk',
    requiredPermission: Permission.MANAGE_RISK_MODELS,
  },
  {
    path: '/firm/admin',
    label: 'Admin Console',
    icon: 'admin',
    requiredPermission: Permission.MANAGE_USERS,
  },
  {
    path: '/firm/settings',
    label: 'Settings',
    icon: 'settings',
    // Everyone can access their own settings
  },
];

/**
 * Get navigation items filtered by user permissions
 */
export const getFilteredNavigation = (
  userRole: UserRole | undefined,
  hasPermission: (permission: Permission) => boolean,
  hasAnyPermission: (permissions: Permission[]) => boolean,
  hasAllPermissions: (permissions: Permission[]) => boolean
): NavItem[] => {
  if (!userRole) return [];

  return navigationConfig.filter(item => {
    // Check role-based access
    if (item.allowedRoles && !item.allowedRoles.includes(userRole)) {
      return false;
    }

    // Check single permission
    if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
      return false;
    }

    // Check multiple permissions
    if (item.requiredPermissions && item.requiredPermissions.length > 0) {
      const hasAccess = item.requireAll
        ? hasAllPermissions(item.requiredPermissions)
        : hasAnyPermission(item.requiredPermissions);

      if (!hasAccess) {
        return false;
      }
    }

    return true;
  });
};
