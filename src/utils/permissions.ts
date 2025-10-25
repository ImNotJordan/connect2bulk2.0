// Permission constants and utilities for RBAC

export type UserRole = 
  | 'ORGANIZATION_OWNER'
  | 'ADMIN'
  | 'OPERATION_MANAGER'
  | 'BROKER'
  | 'DISPATCHER'
  | 'DRIVER'
  | 'ACCOUNTING'
  | 'SALES'
  | 'MARKETING'
  | 'CUSTOMER'
  | 'READ_ONLY';

// Permission categories
export const Permission = {
  // Billing & Organization
  MANAGE_BILLING: 'MANAGE_BILLING',
  MANAGE_ORG_SETTINGS: 'MANAGE_ORG_SETTINGS',
  MANAGE_INTEGRATIONS: 'MANAGE_INTEGRATIONS',
  MANAGE_EDI_API_KEYS: 'MANAGE_EDI_API_KEYS',
  MANAGE_INSURANCE_PARTNERS: 'MANAGE_INSURANCE_PARTNERS',
  MANAGE_FACTORING_PARTNERS: 'MANAGE_FACTORING_PARTNERS',
  
  // User Management
  MANAGE_USERS: 'MANAGE_USERS',
  VIEW_USERS: 'VIEW_USERS',
  
  // Operations
  MANAGE_ROUTING_GUIDES: 'MANAGE_ROUTING_GUIDES',
  MANAGE_TEAM_BOARDS: 'MANAGE_TEAM_BOARDS',
  MANAGE_TEMPLATES: 'MANAGE_TEMPLATES',
  MANAGE_TENDER_RULES: 'MANAGE_TENDER_RULES',
  MANAGE_SLA_EXCEPTIONS: 'MANAGE_SLA_EXCEPTIONS',
  MANAGE_PRICING_GUARDRAILS: 'MANAGE_PRICING_GUARDRAILS',
  MANAGE_RISK_MODELS: 'MANAGE_RISK_MODELS',
  IMPORT_RFP: 'IMPORT_RFP',
  APPROVE_RFP: 'APPROVE_RFP',
  
  // Loads & Quotes
  CREATE_LOADS: 'CREATE_LOADS',
  EDIT_LOADS: 'EDIT_LOADS',
  DELETE_LOADS: 'DELETE_LOADS',
  VIEW_LOADS: 'VIEW_LOADS',
  CREATE_QUOTES: 'CREATE_QUOTES',
  EDIT_QUOTES: 'EDIT_QUOTES',
  VIEW_QUOTES: 'VIEW_QUOTES',
  TENDER_LOADS: 'TENDER_LOADS',
  TRACK_LOADS: 'TRACK_LOADS',
  
  // Driver Operations
  ACCEPT_LOADS: 'ACCEPT_LOADS',
  UPDATE_LOAD_STATUS: 'UPDATE_LOAD_STATUS',
  SHARE_LOCATION: 'SHARE_LOCATION',
  UPLOAD_DOCUMENTS: 'UPLOAD_DOCUMENTS',
  CHAT_WITH_DISPATCHER: 'CHAT_WITH_DISPATCHER',
  
  // Communications
  MANAGE_COMMUNICATIONS: 'MANAGE_COMMUNICATIONS',
  VIEW_COMMUNICATIONS: 'VIEW_COMMUNICATIONS',
  MANAGE_ACCESSORIALS: 'MANAGE_ACCESSORIALS',
  
  // Accounting
  MANAGE_INVOICING: 'MANAGE_INVOICING',
  VIEW_INVOICES: 'VIEW_INVOICES',
  MANAGE_FACTORING: 'MANAGE_FACTORING',
  MANAGE_COLLECTIONS: 'MANAGE_COLLECTIONS',
  MANAGE_RECONCILIATION: 'MANAGE_RECONCILIATION',
  VIEW_FINANCIAL_REPORTS: 'VIEW_FINANCIAL_REPORTS',
  MANAGE_CARRIER_PAYOUTS: 'MANAGE_CARRIER_PAYOUTS',
  
  // Sales & Marketing (CRM)
  MANAGE_CRM: 'MANAGE_CRM',
  VIEW_CRM: 'VIEW_CRM',
  MANAGE_PROSPECTS: 'MANAGE_PROSPECTS',
  MANAGE_PIPELINES: 'MANAGE_PIPELINES',
  MANAGE_CAMPAIGNS: 'MANAGE_CAMPAIGNS',
  MANAGE_SOCIAL_POSTING: 'MANAGE_SOCIAL_POSTING',
  USE_AI_NEGOTIATION: 'USE_AI_NEGOTIATION',
  
  // Analytics & Reporting
  VIEW_ANALYTICS: 'VIEW_ANALYTICS',
  VIEW_ADVANCED_ANALYTICS: 'VIEW_ADVANCED_ANALYTICS',
  
  // Trucks
  CREATE_TRUCKS: 'CREATE_TRUCKS',
  EDIT_TRUCKS: 'EDIT_TRUCKS',
  DELETE_TRUCKS: 'DELETE_TRUCKS',
  VIEW_TRUCKS: 'VIEW_TRUCKS',
  
  // Search
  USE_GLOBAL_SEARCH: 'USE_GLOBAL_SEARCH',
  
  // AI Workflows
  USE_AI_WORKFLOWS: 'USE_AI_WORKFLOWS',
} as const;

// Permission type derived from the const object
export type Permission = typeof Permission[keyof typeof Permission];

// Role-based permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ORGANIZATION_OWNER: [
    // All permissions
    ...Object.values(Permission),
  ],
  
  ADMIN: [
    // All permissions except some org-level settings
    Permission.MANAGE_ORG_SETTINGS,
    Permission.MANAGE_INTEGRATIONS,
    Permission.MANAGE_EDI_API_KEYS,
    Permission.MANAGE_INSURANCE_PARTNERS,
    Permission.MANAGE_FACTORING_PARTNERS,
    Permission.MANAGE_USERS,
    Permission.VIEW_USERS,
    Permission.MANAGE_ROUTING_GUIDES,
    Permission.MANAGE_TEAM_BOARDS,
    Permission.MANAGE_TEMPLATES,
    Permission.MANAGE_TENDER_RULES,
    Permission.MANAGE_SLA_EXCEPTIONS,
    Permission.MANAGE_PRICING_GUARDRAILS,
    Permission.MANAGE_RISK_MODELS,
    Permission.IMPORT_RFP,
    Permission.APPROVE_RFP,
    Permission.CREATE_LOADS,
    Permission.EDIT_LOADS,
    Permission.DELETE_LOADS,
    Permission.VIEW_LOADS,
    Permission.CREATE_QUOTES,
    Permission.EDIT_QUOTES,
    Permission.VIEW_QUOTES,
    Permission.TENDER_LOADS,
    Permission.TRACK_LOADS,
    Permission.MANAGE_COMMUNICATIONS,
    Permission.VIEW_COMMUNICATIONS,
    Permission.MANAGE_ACCESSORIALS,
    Permission.MANAGE_INVOICING,
    Permission.VIEW_INVOICES,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.MANAGE_CRM,
    Permission.VIEW_CRM,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_ADVANCED_ANALYTICS,
    Permission.CREATE_TRUCKS,
    Permission.EDIT_TRUCKS,
    Permission.DELETE_TRUCKS,
    Permission.VIEW_TRUCKS,
    Permission.USE_GLOBAL_SEARCH,
    Permission.USE_AI_WORKFLOWS,
  ],
  
  OPERATION_MANAGER: [
    Permission.VIEW_USERS,
    Permission.MANAGE_ROUTING_GUIDES,
    Permission.MANAGE_TEAM_BOARDS,
    Permission.MANAGE_TEMPLATES,
    Permission.MANAGE_TENDER_RULES,
    Permission.MANAGE_SLA_EXCEPTIONS,
    Permission.MANAGE_PRICING_GUARDRAILS,
    Permission.IMPORT_RFP,
    Permission.APPROVE_RFP,
    Permission.CREATE_LOADS,
    Permission.EDIT_LOADS,
    Permission.DELETE_LOADS,
    Permission.VIEW_LOADS,
    Permission.CREATE_QUOTES,
    Permission.EDIT_QUOTES,
    Permission.VIEW_QUOTES,
    Permission.TENDER_LOADS,
    Permission.TRACK_LOADS,
    Permission.MANAGE_COMMUNICATIONS,
    Permission.VIEW_COMMUNICATIONS,
    Permission.MANAGE_ACCESSORIALS,
    Permission.VIEW_INVOICES,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.VIEW_CRM,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_ADVANCED_ANALYTICS,
    Permission.CREATE_TRUCKS,
    Permission.EDIT_TRUCKS,
    Permission.DELETE_TRUCKS,
    Permission.VIEW_TRUCKS,
    Permission.USE_GLOBAL_SEARCH,
    Permission.USE_AI_WORKFLOWS,
  ],
  
  BROKER: [
    Permission.CREATE_LOADS,
    Permission.EDIT_LOADS,
    Permission.VIEW_LOADS,
    Permission.CREATE_QUOTES,
    Permission.EDIT_QUOTES,
    Permission.VIEW_QUOTES,
    Permission.TENDER_LOADS,
    Permission.TRACK_LOADS,
    Permission.MANAGE_COMMUNICATIONS,
    Permission.VIEW_COMMUNICATIONS,
    Permission.MANAGE_ACCESSORIALS,
    Permission.VIEW_INVOICES,
    Permission.VIEW_CRM,
    Permission.MANAGE_PROSPECTS,
    Permission.VIEW_ANALYTICS,
    Permission.CREATE_TRUCKS,
    Permission.EDIT_TRUCKS,
    Permission.VIEW_TRUCKS,
    Permission.USE_GLOBAL_SEARCH,
    Permission.USE_AI_WORKFLOWS,
  ],
  
  DISPATCHER: [
    Permission.CREATE_LOADS,
    Permission.EDIT_LOADS,
    Permission.VIEW_LOADS,
    Permission.CREATE_QUOTES,
    Permission.VIEW_QUOTES,
    Permission.TENDER_LOADS,
    Permission.TRACK_LOADS,
    Permission.MANAGE_COMMUNICATIONS,
    Permission.VIEW_COMMUNICATIONS,
    Permission.MANAGE_ACCESSORIALS,
    Permission.VIEW_INVOICES,
    Permission.VIEW_ANALYTICS,
    Permission.CREATE_TRUCKS,
    Permission.EDIT_TRUCKS,
    Permission.VIEW_TRUCKS,
    Permission.USE_GLOBAL_SEARCH,
    Permission.USE_AI_WORKFLOWS,
    Permission.CHAT_WITH_DISPATCHER,
  ],
  
  DRIVER: [
    Permission.VIEW_LOADS,
    Permission.ACCEPT_LOADS,
    Permission.UPDATE_LOAD_STATUS,
    Permission.SHARE_LOCATION,
    Permission.UPLOAD_DOCUMENTS,
    Permission.CHAT_WITH_DISPATCHER,
    Permission.VIEW_COMMUNICATIONS,
  ],
  
  ACCOUNTING: [
    Permission.VIEW_LOADS,
    Permission.VIEW_QUOTES,
    Permission.VIEW_TRUCKS,
    Permission.MANAGE_INVOICING,
    Permission.VIEW_INVOICES,
    Permission.MANAGE_FACTORING,
    Permission.MANAGE_COLLECTIONS,
    Permission.MANAGE_RECONCILIATION,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.MANAGE_CARRIER_PAYOUTS,
    Permission.VIEW_ANALYTICS,
    Permission.USE_GLOBAL_SEARCH,
  ],
  
  SALES: [
    Permission.VIEW_LOADS,
    Permission.CREATE_QUOTES,
    Permission.EDIT_QUOTES,
    Permission.VIEW_QUOTES,
    Permission.IMPORT_RFP,
    Permission.MANAGE_CRM,
    Permission.VIEW_CRM,
    Permission.MANAGE_PROSPECTS,
    Permission.MANAGE_PIPELINES,
    Permission.MANAGE_CAMPAIGNS,
    Permission.USE_AI_NEGOTIATION,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_TRUCKS,
    Permission.USE_GLOBAL_SEARCH,
    Permission.USE_AI_WORKFLOWS,
  ],
  
  MARKETING: [
    Permission.VIEW_LOADS,
    Permission.VIEW_QUOTES,
    Permission.MANAGE_CRM,
    Permission.VIEW_CRM,
    Permission.MANAGE_PROSPECTS,
    Permission.MANAGE_CAMPAIGNS,
    Permission.MANAGE_SOCIAL_POSTING,
    Permission.VIEW_ANALYTICS,
    Permission.USE_GLOBAL_SEARCH,
  ],
  
  CUSTOMER: [
    Permission.VIEW_LOADS,
    Permission.VIEW_QUOTES,
    Permission.CREATE_LOADS,
    Permission.VIEW_COMMUNICATIONS,
    Permission.VIEW_INVOICES,
    Permission.UPLOAD_DOCUMENTS,
  ],
  
  READ_ONLY: [
    Permission.VIEW_LOADS,
    Permission.VIEW_QUOTES,
    Permission.VIEW_TRUCKS,
    Permission.VIEW_COMMUNICATIONS,
    Permission.VIEW_INVOICES,
    Permission.VIEW_CRM,
    Permission.VIEW_ANALYTICS,
  ],
};

// Helper functions
export const hasPermission = (userRole: UserRole | undefined, permission: Permission): boolean => {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const hasAnyPermission = (userRole: UserRole | undefined, permissions: Permission[]): boolean => {
  if (!userRole) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole: UserRole | undefined, permissions: Permission[]): boolean => {
  if (!userRole) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
};

export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'ORGANIZATION_OWNER' || userRole === 'ADMIN';
};

export const isOperationsStaff = (userRole: UserRole | undefined): boolean => {
  return userRole === 'ORGANIZATION_OWNER' || 
         userRole === 'ADMIN' || 
         userRole === 'OPERATION_MANAGER';
};

export const canManageUsers = (userRole: UserRole | undefined): boolean => {
  return hasPermission(userRole, Permission.MANAGE_USERS);
};

// Role display names for UI
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  ORGANIZATION_OWNER: 'Organization Owner',
  ADMIN: 'Administrator',
  OPERATION_MANAGER: 'Operations Manager',
  BROKER: 'Broker',
  DISPATCHER: 'Dispatcher',
  DRIVER: 'Driver',
  ACCOUNTING: 'Accounting',
  SALES: 'Sales',
  MARKETING: 'Marketing',
  CUSTOMER: 'Customer',
  READ_ONLY: 'Read-Only',
};

// Role descriptions for UI
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  ORGANIZATION_OWNER: 'Full system access including billing, org settings, and all features',
  ADMIN: 'Full access to all features except billing',
  OPERATION_MANAGER: 'Manage operations including team boards, routing guides, and RFPs',
  BROKER: 'Create and manage loads, quotes, and customer communications',
  DISPATCHER: 'Dispatch loads, track shipments, and communicate with drivers',
  DRIVER: 'Mobile access for load acceptance, status updates, and document uploads',
  ACCOUNTING: 'Manage invoicing, factoring, collections, and financial reporting',
  SALES: 'Manage CRM, prospects, quotes, and customer relationships',
  MARKETING: 'Manage marketing campaigns, social media, and CRM activities',
  CUSTOMER: 'Limited access for customers to view loads and communications',
  READ_ONLY: 'View-only access to shipments, documents, and invoices',
};

// Get all available roles for dropdown
export const getAllRoles = (): UserRole[] => {
  return Object.keys(ROLE_PERMISSIONS) as UserRole[];
};

// Get role hierarchy level (lower number = higher privilege)
export const getRoleLevel = (role: UserRole): number => {
  const hierarchy: Record<UserRole, number> = {
    ORGANIZATION_OWNER: 1,
    ADMIN: 2,
    OPERATION_MANAGER: 3,
    BROKER: 4,
    DISPATCHER: 4,
    ACCOUNTING: 4,
    SALES: 4,
    MARKETING: 5,
    DRIVER: 6,
    CUSTOMER: 7,
    READ_ONLY: 8,
  };
  return hierarchy[role] || 999;
};

// Check if user can assign a role to another user (can only assign roles at same or lower level)
export const canAssignRole = (assignerRole: UserRole, targetRole: UserRole): boolean => {
  return getRoleLevel(assignerRole) <= getRoleLevel(targetRole);
};
