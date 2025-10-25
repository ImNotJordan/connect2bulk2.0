# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This system implements a comprehensive RBAC (Role-Based Access Control) system with fine-grained permissions for different user roles in the logistics/freight management platform.

## User Roles

### 1. **Organization Owner** (ORGANIZATION_OWNER)
- **Highest privilege level**
- Full system access including billing, org settings, integrations
- Can manage all aspects of the organization
- **Key Capabilities:**
  - Billing and subscription management
  - Organization settings
  - Global routing guides
  - Risk model governance
  - Insurance & factoring partners
  - EDI/API keys management
  - All lower-level permissions

### 2. **Admin** (ADMIN)
- **Second-highest privilege**
- Full access to all features except billing
- Can manage users and organizational operations
- **Key Capabilities:**
  - Same as Organization Owner except billing
  - User management
  - Integration management
  - All operational features

### 3. **Operations Manager** (OPERATION_MANAGER)
- **Operations-focused role**
- Manages day-to-day operations
- **Key Capabilities:**
  - Team boards management
  - Templates and routing guides
  - Tender rules and exceptions
  - SLA management
  - Pricing guardrails
  - RFP import & approvals
  - Load and quote management
  - Advanced analytics

### 4. **Broker** (BROKER)
- **Customer-facing operations**
- Creates and manages loads, quotes, and customer relationships
- **Key Capabilities:**
  - Create/edit loads and quotes
  - Tender loads
  - Track shipments
  - Customer communications
  - Manage accessorials
  - CRM access
  - AI-powered workflows

### 5. **Dispatcher** (DISPATCHER)
- **Logistics coordination**
- Manages load assignments and driver communications
- **Key Capabilities:**
  - Create/edit loads
  - Tender and track loads
  - Driver communications
  - Status updates
  - Basic analytics
  - AI workflows

### 6. **Driver** (DRIVER)
- **Mobile-focused role**
- Field operations and load execution
- **Key Capabilities:**
  - Accept assigned loads
  - Update load status
  - Share location
  - Upload documents (BOL, POD, etc.)
  - Chat with dispatchers
  - View assigned loads

### 7. **Accounting** (ACCOUNTING)
- **Financial operations**
- Manages invoicing, payments, and financial reporting
- **Key Capabilities:**
  - Invoicing management
  - Factoring operations
  - Collections management
  - Reconciliation
  - Tax preparation assistance
  - Carrier payouts (for brokers)
  - Financial reports

### 8. **Sales** (SALES)
- **Sales and CRM focus**
- Manages prospects, pipelines, and customer acquisition
- **Key Capabilities:**
  - Full CRM access
  - Prospect management
  - Pipeline management
  - Campaign management
  - Quote creation
  - RFP import
  - AI negotiation bot
  - Social posting

### 9. **Marketing** (MARKETING)
- **Marketing and outreach**
- Manages campaigns and brand presence
- **Key Capabilities:**
  - CRM access (limited)
  - Campaign management
  - Social media posting
  - Prospect management
  - Analytics viewing

### 10. **Customer** (CUSTOMER)
- **External customer access**
- Limited access for shipper/customer portal
- **Key Capabilities:**
  - View own shipments
  - View quotes
  - Create load requests
  - View invoices
  - Upload documents
  - Basic communications

### 11. **Read-Only** (READ_ONLY)
- **View-only access**
- Customer portal or auditor access
- **Key Capabilities:**
  - View loads and shipments
  - View quotes and pricing
  - View documents
  - View invoices
  - View analytics/reports
  - No edit/create permissions

## Implementation Guide

### 1. Using the RBAC Context

```typescript
import { useRBAC, useUserInfo, useHasPermission } from '../contexts/RBACContext';
import { Permission } from '../utils/permissions';

function MyComponent() {
  const { userInfo, hasPermission } = useRBAC();
  const canCreateLoads = useHasPermission(Permission.CREATE_LOADS);

  return (
    <div>
      <h1>Welcome, {userInfo?.firstName}!</h1>
      <p>Your role: {userInfo?.role}</p>
      {canCreateLoads && <button>Create New Load</button>}
    </div>
  );
}
```

### 2. Protecting Routes

```typescript
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Permission } from '../utils/permissions';

// In your route configuration
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredPermission={Permission.MANAGE_USERS}>
      <AdminConsole />
    </ProtectedRoute>
  }
/>

// With multiple permissions (any of them)
<Route
  path="/accounting"
  element={
    <ProtectedRoute 
      requiredPermissions={[
        Permission.VIEW_INVOICES, 
        Permission.VIEW_FINANCIAL_REPORTS
      ]}
      requireAll={false}
    >
      <AccountingDashboard />
    </ProtectedRoute>
  }
/>

// With role-based access
<Route
  path="/operations"
  element={
    <ProtectedRoute 
      allowedRoles={['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER']}
    >
      <OperationsPanel />
    </ProtectedRoute>
  }
/>
```

### 3. Conditional UI Elements

```typescript
import { ProtectedElement } from '../components/ProtectedRoute';
import { Permission } from '../utils/permissions';

function LoadBoard() {
  return (
    <div>
      <h1>Load Board</h1>
      
      {/* Show button only if user has permission */}
      <ProtectedElement requiredPermission={Permission.CREATE_LOADS}>
        <button>Create New Load</button>
      </ProtectedElement>

      {/* Show warning if user doesn't have permission */}
      <ProtectedElement 
        requiredPermission={Permission.EDIT_LOADS}
        hide={false}
        fallback={<p>You don't have permission to edit loads</p>}
      >
        <button>Edit Load</button>
      </ProtectedElement>

      {/* Multiple permissions */}
      <ProtectedElement 
        requiredPermissions={[Permission.DELETE_LOADS, Permission.MANAGE_USERS]}
        requireAll={true}
      >
        <button>Bulk Delete</button>
      </ProtectedElement>
    </div>
  );
}
```

### 4. Programmatic Access Checks

```typescript
import { useHasAccess } from '../components/ProtectedRoute';
import { Permission } from '../utils/permissions';

function ActionMenu() {
  const canEdit = useHasAccess(Permission.EDIT_LOADS);
  const canDelete = useHasAccess(Permission.DELETE_LOADS);

  const handleAction = () => {
    if (!canEdit) {
      alert('You do not have permission to edit loads');
      return;
    }
    // Proceed with action
  };

  return (
    <div>
      <button onClick={handleAction} disabled={!canEdit}>
        Edit
      </button>
      {canDelete && <button>Delete</button>}
    </div>
  );
}
```

### 5. Filtering Navigation Based on Roles

```typescript
import { useRBAC } from '../contexts/RBACContext';
import { getFilteredNavigation } from '../config/navigationConfig';

function Sidebar() {
  const { userInfo, hasPermission, hasAnyPermission, hasAllPermissions } = useRBAC();

  const navItems = getFilteredNavigation(
    userInfo?.role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  );

  return (
    <nav>
      {navItems.map(item => (
        <a key={item.path} href={item.path}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
```

## Permission Categories

### Billing & Organization
- `MANAGE_BILLING` - Manage billing and subscriptions
- `MANAGE_ORG_SETTINGS` - Change organization settings
- `MANAGE_INTEGRATIONS` - Setup integrations
- `MANAGE_EDI_API_KEYS` - Manage API keys
- `MANAGE_INSURANCE_PARTNERS` - Configure insurance
- `MANAGE_FACTORING_PARTNERS` - Setup factoring

### User Management
- `MANAGE_USERS` - Add/edit/delete users
- `VIEW_USERS` - View user list

### Operations
- `MANAGE_ROUTING_GUIDES` - Setup routing rules
- `MANAGE_TEAM_BOARDS` - Configure team boards
- `MANAGE_TEMPLATES` - Create templates
- `MANAGE_TENDER_RULES` - Setup tender automation
- `MANAGE_SLA_EXCEPTIONS` - Handle SLA issues
- `MANAGE_PRICING_GUARDRAILS` - Set pricing limits
- `MANAGE_RISK_MODELS` - Configure risk assessment

### Loads & Quotes
- `CREATE_LOADS` / `EDIT_LOADS` / `DELETE_LOADS` / `VIEW_LOADS`
- `CREATE_QUOTES` / `EDIT_QUOTES` / `VIEW_QUOTES`
- `TENDER_LOADS` - Send tenders to carriers
- `TRACK_LOADS` - Track shipments

### Driver Operations
- `ACCEPT_LOADS` - Accept load assignments
- `UPDATE_LOAD_STATUS` - Update delivery status
- `SHARE_LOCATION` - GPS tracking
- `UPLOAD_DOCUMENTS` - Upload BOL, POD
- `CHAT_WITH_DISPATCHER` - In-app messaging

### Financial
- `MANAGE_INVOICING` / `VIEW_INVOICES`
- `MANAGE_FACTORING` - Factoring operations
- `MANAGE_COLLECTIONS` - AR management
- `MANAGE_RECONCILIATION` - Reconcile accounts
- `VIEW_FINANCIAL_REPORTS` - Financial analytics
- `MANAGE_CARRIER_PAYOUTS` - Pay carriers

### CRM & Sales
- `MANAGE_CRM` / `VIEW_CRM`
- `MANAGE_PROSPECTS` - Lead management
- `MANAGE_PIPELINES` - Sales pipelines
- `MANAGE_CAMPAIGNS` - Marketing campaigns
- `MANAGE_SOCIAL_POSTING` - Social media
- `USE_AI_NEGOTIATION` - AI-powered pricing

## Backend Authorization

When making API calls, the user's role is automatically included in their Cognito JWT token. The Amplify Data authorization rules check these roles:

```typescript
// In amplify/data/resource.ts
Load: a.model({
  // ... fields
}).authorization((allow) => [
  allow.owner().to(['create', 'update', 'delete', 'read']),
  allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER'])
    .to(['create', 'read', 'update', 'delete']),
  allow.authenticated().to(['create', 'read', 'update', 'delete']),
]),
```

## Best Practices

1. **Always check permissions on the backend** - Frontend checks are for UX only
2. **Use the most specific permission** - Don't grant broader access than needed
3. **Test with different roles** - Verify each role sees appropriate UI
4. **Document role changes** - Keep this guide updated when adding features
5. **Use ProtectedElement for UI** - Better than inline conditionals
6. **Log permission checks** - For debugging and audit trails

## Future Enhancements (v1.1+)

- [ ] Customer Portal with read-only access
- [ ] Custom role creation (role templates)
- [ ] Permission inheritance
- [ ] Team-based permissions
- [ ] Time-based access (temporary elevated permissions)
- [ ] Audit logging for permission checks
- [ ] Multi-tenant organization hierarchies
