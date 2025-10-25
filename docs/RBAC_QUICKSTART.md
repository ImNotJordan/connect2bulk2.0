# RBAC Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Import RBAC Hooks

```typescript
import { useRBAC, useHasPermission } from '../contexts/RBACContext';
import { Permission } from '../utils/permissions';
```

### Step 2: Use in Your Component

```typescript
function MyComponent() {
  const { userInfo, hasPermission } = useRBAC();
  
  return (
    <div>
      <h1>Welcome, {userInfo?.firstName}!</h1>
      {hasPermission(Permission.CREATE_LOADS) && (
        <button>Create Load</button>
      )}
    </div>
  );
}
```

### Step 3: Protect Routes

```typescript
import { ProtectedRoute } from '../components/ProtectedRoute';

<Route
  path="/admin"
  element={
    <ProtectedRoute requiredPermission={Permission.MANAGE_USERS}>
      <AdminConsole />
    </ProtectedRoute>
  }
/>
```

## 📋 Common Patterns

### Pattern 1: Show/Hide Buttons

```typescript
import { ProtectedElement } from '../components/ProtectedRoute';

<ProtectedElement requiredPermission={Permission.DELETE_LOADS}>
  <button>Delete</button>
</ProtectedElement>
```

### Pattern 2: Conditional Actions

```typescript
const { hasPermission } = useRBAC();

const handleDelete = () => {
  if (!hasPermission(Permission.DELETE_LOADS)) {
    alert('No permission');
    return;
  }
  // Proceed with delete
};
```

### Pattern 3: Role-Based Dashboard

```typescript
const { userInfo } = useRBAC();

switch (userInfo?.role) {
  case 'DRIVER':
    return <DriverView />;
  case 'DISPATCHER':
    return <DispatcherView />;
  case 'ADMIN':
    return <AdminView />;
  default:
    return <DefaultView />;
}
```

### Pattern 4: Multiple Permissions (ANY)

```typescript
<ProtectedElement 
  requiredPermissions={[Permission.EDIT_LOADS, Permission.DELETE_LOADS]}
  requireAll={false}
>
  <button>Bulk Actions</button>
</ProtectedElement>
```

### Pattern 5: Multiple Permissions (ALL)

```typescript
<ProtectedElement 
  requiredPermissions={[Permission.MANAGE_USERS, Permission.MANAGE_BILLING]}
  requireAll={true}
>
  <button>Admin Settings</button>
</ProtectedElement>
```

## 🎯 Role Mapping Quick Reference

| Role | Primary Use Case | Key Permissions |
|------|------------------|-----------------|
| **ORGANIZATION_OWNER** | Company owner | Everything including billing |
| **ADMIN** | System administrator | Everything except billing |
| **OPERATION_MANAGER** | Operations lead | Team management, routing, RFPs |
| **BROKER** | Customer-facing | Loads, quotes, CRM |
| **DISPATCHER** | Logistics coordinator | Load dispatch, tracking |
| **DRIVER** | Field operations | Mobile app, status updates |
| **ACCOUNTING** | Finance team | Invoicing, payments, reports |
| **SALES** | Sales team | CRM, quotes, prospects |
| **MARKETING** | Marketing team | Campaigns, social media |
| **CUSTOMER** | External customers | View loads, documents |
| **READ_ONLY** | Auditor/viewer | View-only access |

## 🔧 Integration Checklist

- [ ] Wrap App with `<RBACProvider>` in App.tsx ✅
- [ ] Update schema with new roles ✅
- [ ] Add permission checks to sensitive buttons
- [ ] Protect admin routes with ProtectedRoute
- [ ] Filter navigation menu by permissions
- [ ] Add role display in user profile
- [ ] Test each role thoroughly
- [ ] Document custom permissions

## 🛠️ Utility Functions

```typescript
import { 
  hasPermission,
  isAdmin,
  isOperationsStaff,
  canManageUsers,
  ROLE_DISPLAY_NAMES,
  getAllRoles
} from '../utils/permissions';

// Check permission for any role
hasPermission('BROKER', Permission.CREATE_LOADS); // true

// Check if role is admin-level
isAdmin('ADMIN'); // true
isAdmin('BROKER'); // false

// Get display name
ROLE_DISPLAY_NAMES['DRIVER']; // "Driver"

// Get all available roles
const roles = getAllRoles(); // ['ORGANIZATION_OWNER', 'ADMIN', ...]
```

## 🎨 Styling Tips

```typescript
// Disabled state for no permission
<button disabled={!hasPermission(Permission.DELETE_LOADS)}>
  Delete
</button>

// Gray out elements
<div style={{ opacity: canEdit ? 1 : 0.5 }}>
  {/* Content */}
</div>

// Show permission badge
{isAdmin() && <span className="badge">Admin</span>}
```

## 🐛 Debugging

```typescript
// Log current user permissions
const { userInfo, hasPermission } = useRBAC();
console.log('Current role:', userInfo?.role);
console.log('Can create loads:', hasPermission(Permission.CREATE_LOADS));

// Get all permissions for role
import { ROLE_PERMISSIONS } from '../utils/permissions';
console.log('All permissions:', ROLE_PERMISSIONS[userInfo?.role]);
```

## ⚠️ Important Notes

1. **Always check permissions on backend** - Frontend checks are for UX only
2. **Use specific permissions** - Don't grant broader access than needed
3. **Test with multiple roles** - Create test accounts for each role
4. **Keep documentation updated** - Document any custom permissions

## 📚 Next Steps

1. Read full guide: `docs/RBAC_GUIDE.md`
2. Review examples: `src/examples/RBACExamples.tsx`
3. Update your components with permission checks
4. Test with different user roles
5. Add backend authorization rules in `amplify/data/resource.ts`
