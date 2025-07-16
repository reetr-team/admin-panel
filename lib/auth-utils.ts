interface Auth0User {
  sub?: string;
  name?: string;
  email?: string;
  picture?: string;
  user_metadata?: any;
  app_metadata?: any;
  [key: string]: any;
}

export function isUserAdmin(user: Auth0User | null | undefined): boolean {
  if (!user) return false;

  // Check multiple possible locations for admin flag
  // 1. Custom claim (e.g., https://yourapp.com/admin or admin)
  if (user.admin === true || user['https://yourapp.com/admin'] === true) {
    return true;
  }

  // 2. App metadata
  if (user.app_metadata?.admin === true || user.app_metadata?.isAdmin === true) {
    return true;
  }

  // 3. User metadata
  if (user.user_metadata?.admin === true || user.user_metadata?.isAdmin === true) {
    return true;
  }

  // 4. Roles array (common pattern)
  const roles = user.roles || user['https://yourapp.com/roles'] || user.app_metadata?.roles;
  if (Array.isArray(roles) && roles.includes('admin')) {
    return true;
  }

  // 5. Direct role property
  if (user.role === 'admin' || user['https://yourapp.com/role'] === 'admin') {
    return true;
  }

  return false;
}

export function getAdminStatus(user: Auth0User | null | undefined): {
  isAdmin: boolean;
  adminSource?: string;
} {
  if (!user) return { isAdmin: false };

  // Check and return the source of admin status
  if (user.admin === true) {
    return { isAdmin: true, adminSource: 'user.admin' };
  }
  
  if (user['https://yourapp.com/admin'] === true) {
    return { isAdmin: true, adminSource: 'custom claim: admin' };
  }

  if (user.app_metadata?.admin === true) {
    return { isAdmin: true, adminSource: 'app_metadata.admin' };
  }

  if (user.app_metadata?.isAdmin === true) {
    return { isAdmin: true, adminSource: 'app_metadata.isAdmin' };
  }

  if (user.user_metadata?.admin === true) {
    return { isAdmin: true, adminSource: 'user_metadata.admin' };
  }

  if (user.user_metadata?.isAdmin === true) {
    return { isAdmin: true, adminSource: 'user_metadata.isAdmin' };
  }

  const roles = user.roles || user['https://yourapp.com/roles'] || user.app_metadata?.roles;
  if (Array.isArray(roles) && roles.includes('admin')) {
    return { isAdmin: true, adminSource: 'roles array' };
  }

  if (user.role === 'admin') {
    return { isAdmin: true, adminSource: 'user.role' };
  }

  if (user['https://yourapp.com/role'] === 'admin') {
    return { isAdmin: true, adminSource: 'custom claim: role' };
  }

  return { isAdmin: false };
}