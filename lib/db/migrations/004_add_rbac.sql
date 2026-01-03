-- RBAC (Role-Based Access Control) Schema
-- This migration adds roles, permissions, and user-role assignments

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(resource, action)
);

-- Role-Permission junction table (many-to-many)
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- User-Role junction table (many-to-many)
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource);
CREATE INDEX IF NOT EXISTS idx_permissions_action ON permissions(action);

-- Pre-populate roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Full system access with all permissions'),
  ('user', 'Standard user with basic transaction permissions'),
  ('auditor', 'Read-only access for auditing purposes'),
  ('support', 'Support staff with limited update permissions')
ON CONFLICT (name) DO NOTHING;

-- Pre-populate permissions
INSERT INTO permissions (resource, action, description) VALUES
  -- Transaction permissions
  ('transactions', 'create', 'Create new transactions'),
  ('transactions', 'read', 'View transactions'),
  ('transactions', 'update', 'Update transaction details'),
  ('transactions', 'reverse', 'Reverse transactions'),
  ('transactions', 'delete', 'Delete transactions'),
  
  -- Wallet permissions
  ('wallets', 'create', 'Create wallets'),
  ('wallets', 'read', 'View wallet information'),
  ('wallets', 'update', 'Update wallet details'),
  ('wallets', 'delete', 'Delete wallets'),
  
  -- Audit log permissions
  ('audit', 'read', 'View audit logs'),
  ('audit', 'export', 'Export audit logs'),
  
  -- User permissions
  ('users', 'create', 'Create users'),
  ('users', 'read', 'View user information'),
  ('users', 'update', 'Update user details'),
  ('users', 'delete', 'Delete users'),
  
  -- Role permissions
  ('roles', 'create', 'Create roles'),
  ('roles', 'read', 'View roles and permissions'),
  ('roles', 'update', 'Update roles and permissions'),
  ('roles', 'delete', 'Delete roles'),
  ('roles', 'assign', 'Assign roles to users')
ON CONFLICT (resource, action) DO NOTHING;

-- Assign permissions to roles
-- Admin: all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- User: basic transaction and wallet permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'user'
  AND (
    (p.resource = 'transactions' AND p.action IN ('create', 'read'))
    OR (p.resource = 'wallets' AND p.action = 'read')
  )
ON CONFLICT DO NOTHING;

-- Auditor: read-only permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'auditor'
  AND (
    (p.resource = 'transactions' AND p.action = 'read')
    OR (p.resource = 'wallets' AND p.action = 'read')
    OR (p.resource = 'audit' AND p.action IN ('read', 'export'))
    OR (p.resource = 'users' AND p.action = 'read')
  )
ON CONFLICT DO NOTHING;

-- Support: read and limited update permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'support'
  AND (
    (p.resource = 'transactions' AND p.action IN ('read', 'update'))
    OR (p.resource = 'wallets' AND p.action IN ('read', 'update'))
    OR (p.resource = 'audit' AND p.action = 'read')
    OR (p.resource = 'users' AND p.action = 'read')
  )
ON CONFLICT DO NOTHING;

-- Assign default 'user' role to all existing users
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE r.name = 'user'
  AND NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id
  )
ON CONFLICT DO NOTHING;

