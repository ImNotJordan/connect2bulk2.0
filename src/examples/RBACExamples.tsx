/**
 * RBAC Usage Examples
 * 
 * This file demonstrates various ways to implement role-based access control
 * in your components. Copy these patterns to your actual components.
 */

import React from 'react';
import { useRBAC, useUserInfo, useHasPermission } from '../contexts/RBACContext';
import { ProtectedElement, useHasAccess } from '../components/ProtectedRoute';
import { Permission, ROLE_DISPLAY_NAMES } from '../utils/permissions';

/**
 * Example 1: Basic permission check with useRBAC hook
 */
export const Example1_BasicPermissionCheck: React.FC = () => {
  const { userInfo, hasPermission } = useRBAC();

  return (
    <div>
      <h2>Welcome, {userInfo?.firstName || 'User'}!</h2>
      <p>Your role: {userInfo?.role ? ROLE_DISPLAY_NAMES[userInfo.role] : 'Unknown'}</p>
      
      {hasPermission(Permission.CREATE_LOADS) && (
        <button>Create New Load</button>
      )}
      
      {hasPermission(Permission.MANAGE_USERS) && (
        <button>Manage Users</button>
      )}
    </div>
  );
};

/**
 * Example 2: Using ProtectedElement component
 */
export const Example2_ProtectedElements: React.FC = () => {
  return (
    <div>
      <h2>Load Board Actions</h2>
      
      {/* Only show if user has permission */}
      <ProtectedElement requiredPermission={Permission.CREATE_LOADS}>
        <button>Create Load</button>
      </ProtectedElement>

      {/* Show fallback message if no permission */}
      <ProtectedElement 
        requiredPermission={Permission.EDIT_LOADS}
        hide={false}
        fallback={<p style={{ color: 'gray' }}>You need edit permissions</p>}
      >
        <button>Edit Load</button>
      </ProtectedElement>

      {/* Multiple permissions - user needs ANY of them */}
      <ProtectedElement 
        requiredPermissions={[Permission.DELETE_LOADS, Permission.MANAGE_USERS]}
        requireAll={false}
      >
        <button>Bulk Actions</button>
      </ProtectedElement>

      {/* Multiple permissions - user needs ALL of them */}
      <ProtectedElement 
        requiredPermissions={[Permission.DELETE_LOADS, Permission.MANAGE_USERS]}
        requireAll={true}
      >
        <button>Admin Bulk Delete</button>
      </ProtectedElement>

      {/* Role-based access */}
      <ProtectedElement 
        allowedRoles={['ORGANIZATION_OWNER', 'ADMIN']}
      >
        <button>Organization Settings</button>
      </ProtectedElement>
    </div>
  );
};

/**
 * Example 3: Programmatic permission checks
 */
export const Example3_ProgrammaticChecks: React.FC = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin } = useRBAC();

  const handleCreateLoad = () => {
    if (!hasPermission(Permission.CREATE_LOADS)) {
      alert('You do not have permission to create loads');
      return;
    }
    // Proceed with creating load
    console.log('Creating load...');
  };

  const handleBulkOperation = () => {
    const requiredPerms = [Permission.EDIT_LOADS, Permission.DELETE_LOADS];
    
    if (!hasAllPermissions(requiredPerms)) {
      alert('You need both edit and delete permissions for bulk operations');
      return;
    }
    // Proceed with bulk operation
    console.log('Performing bulk operation...');
  };

  return (
    <div>
      <button onClick={handleCreateLoad}>Create Load</button>
      <button onClick={handleBulkOperation}>Bulk Operations</button>
      
      {isAdmin() && <p>You have admin access</p>}
    </div>
  );
};

/**
 * Example 4: Using useHasAccess hook
 */
export const Example4_UseHasAccessHook: React.FC = () => {
  const canCreateLoads = useHasAccess(Permission.CREATE_LOADS);
  const canEditLoads = useHasAccess(Permission.EDIT_LOADS);
  const canDeleteLoads = useHasAccess(Permission.DELETE_LOADS);
  
  const canManageAccounting = useHasAccess(
    undefined,
    [Permission.MANAGE_INVOICING, Permission.VIEW_FINANCIAL_REPORTS],
    false // requireAll = false, so user needs ANY of these permissions
  );

  const isOperationsStaff = useHasAccess(
    undefined,
    undefined,
    false,
    ['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER']
  );

  return (
    <div>
      <h3>Your Capabilities</h3>
      <ul>
        <li>Can create loads: {canCreateLoads ? '✓' : '✗'}</li>
        <li>Can edit loads: {canEditLoads ? '✓' : '✗'}</li>
        <li>Can delete loads: {canDeleteLoads ? '✓' : '✗'}</li>
        <li>Can manage accounting: {canManageAccounting ? '✓' : '✗'}</li>
        <li>Is operations staff: {isOperationsStaff ? '✓' : '✗'}</li>
      </ul>
    </div>
  );
};

/**
 * Example 5: Conditional rendering based on role
 */
export const Example5_RoleBasedUI: React.FC = () => {
  const userInfo = useUserInfo();

  if (!userInfo) {
    return <p>Loading user information...</p>;
  }

  const renderDashboardForRole = () => {
    switch (userInfo.role) {
      case 'DRIVER':
        return <DriverDashboard />;
      case 'DISPATCHER':
        return <DispatcherDashboard />;
      case 'BROKER':
        return <BrokerDashboard />;
      case 'ACCOUNTING':
        return <AccountingDashboard />;
      case 'ORGANIZATION_OWNER':
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };

  return (
    <div>
      <h2>Dashboard for {ROLE_DISPLAY_NAMES[userInfo.role]}</h2>
      {renderDashboardForRole()}
    </div>
  );
};

// Mock dashboard components for example
const DriverDashboard = () => <div>Driver Dashboard - View assigned loads</div>;
const DispatcherDashboard = () => <div>Dispatcher Dashboard - Manage dispatches</div>;
const BrokerDashboard = () => <div>Broker Dashboard - Customer relations</div>;
const AccountingDashboard = () => <div>Accounting Dashboard - Financial overview</div>;
const AdminDashboard = () => <div>Admin Dashboard - Full system control</div>;
const DefaultDashboard = () => <div>Default Dashboard</div>;

/**
 * Example 6: Table with role-based action buttons
 */
export const Example6_TableWithRBAC: React.FC = () => {
  const canEdit = useHasPermission(Permission.EDIT_LOADS);
  const canDelete = useHasPermission(Permission.DELETE_LOADS);
  const canTender = useHasPermission(Permission.TENDER_LOADS);

  const loads = [
    { id: '1', number: 'LOAD-001', status: 'POSTED' },
    { id: '2', number: 'LOAD-002', status: 'BOOKED' },
  ];

  return (
    <table>
      <thead>
        <tr>
          <th>Load Number</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {loads.map(load => (
          <tr key={load.id}>
            <td>{load.number}</td>
            <td>{load.status}</td>
            <td>
              <button>View</button>
              {canEdit && <button>Edit</button>}
              {canTender && <button>Tender</button>}
              {canDelete && <button>Delete</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/**
 * Example 7: Form with conditional fields based on permissions
 */
export const Example7_FormWithRBAC: React.FC = () => {
  const { hasPermission } = useRBAC();
  const canSetPricing = hasPermission(Permission.MANAGE_PRICING_GUARDRAILS);
  const canManageRisk = hasPermission(Permission.MANAGE_RISK_MODELS);

  return (
    <form>
      <h3>Create Load</h3>
      
      {/* Basic fields everyone can see */}
      <input type="text" placeholder="Origin" />
      <input type="text" placeholder="Destination" />
      <input type="date" placeholder="Pickup Date" />
      
      {/* Advanced pricing only for authorized users */}
      {canSetPricing && (
        <div>
          <h4>Pricing Settings</h4>
          <input type="number" placeholder="Minimum Rate" />
          <input type="number" placeholder="Maximum Rate" />
          <input type="number" placeholder="Target Margin %" />
        </div>
      )}
      
      {/* Risk assessment only for authorized users */}
      {canManageRisk && (
        <div>
          <h4>Risk Assessment</h4>
          <select>
            <option>Low Risk</option>
            <option>Medium Risk</option>
            <option>High Risk</option>
          </select>
        </div>
      )}
      
      <button type="submit">Create Load</button>
    </form>
  );
};

/**
 * Example 8: Navigation menu with role-based filtering
 */
export const Example8_NavigationMenu: React.FC = () => {
  const { hasPermission } = useRBAC();

  const menuItems = [
    { label: 'Dashboard', path: '/firm', show: true },
    { label: 'Load Board', path: '/firm/load-board', show: hasPermission(Permission.VIEW_LOADS) },
    { label: 'Truck Board', path: '/firm/truck-board', show: hasPermission(Permission.VIEW_TRUCKS) },
    { label: 'Accounting', path: '/firm/accounting', show: hasPermission(Permission.VIEW_INVOICES) },
    { label: 'CRM', path: '/firm/crm', show: hasPermission(Permission.VIEW_CRM) },
    { label: 'Admin', path: '/firm/admin', show: hasPermission(Permission.MANAGE_USERS) },
  ];

  return (
    <nav>
      <ul>
        {menuItems.filter(item => item.show).map(item => (
          <li key={item.path}>
            <a href={item.path}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
