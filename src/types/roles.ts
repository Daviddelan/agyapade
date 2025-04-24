export type UserRole = 'user' | 'admin' | 'government' | 'financial';

export interface RoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  permissions: string[];
}

export const ROLES: Record<UserRole, RoleDefinition> = {
  user: {
    id: 'user',
    name: 'Regular User',
    description: 'Can upload and manage their own documents',
    permissions: ['upload:own', 'read:own', 'update:own', 'delete:own']
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access and user management',
    permissions: [
      'manage:users',
      'manage:settings',
      'review:documents',
      'verify:documents',
      'delete:documents',
      'view:logs',
      'manage:roles'
    ]
  },
  government: {
    id: 'government',
    name: 'Government Official',
    description: 'Can view and verify land documents',
    permissions: ['read:all', 'verify:documents', 'review:documents']
  },
  financial: {
    id: 'financial',
    name: 'Financial Institution',
    description: 'Can view verified land documents',
    permissions: ['read:verified']
  }
};