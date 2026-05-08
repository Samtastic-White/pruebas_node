CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'EDITOR');
CREATE TYPE permission_type AS ENUM ('READ', 'WRITE', 'DELETE', 'MANAGE_USERS');
CREATE TYPE type_document AS ENUM ('C.C', 'NIT', 'C.E', 'PA');
CREATE TYPE state_code AS ENUM ('PENDING', 'USED'); 
CREATE TYPE state_campaign AS ENUM ('REVISIÓN', 'ACTIVA', 'PROGRAMADA', 'FINALIZADA', 'RECHAZADA'); 
CREATE TYPE rates AS ENUM ('DIARIA', 'SEMANAL', 'QUINCENAL', 'MENSUAL'); 

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name user_role UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name permission_type UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) NOT NULL DEFAULT '',
    address VARCHAR(255) NOT NULL DEFAULT '',
    type_document type_document NOT NULL DEFAULT 'C.C',
    document VARCHAR(32) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    password_hash VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    accept_terms BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
    role_id INTEGER REFERENCES roles(id) ON DELETE RESTRICT,
    assigned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER REFERENCES roles(id) ON DELETE RESTRICT,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE RESTRICT,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_permissions (
    user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE RESTRICT,
    granted BOOLEAN DEFAULT TRUE,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, permission_id)
);

CREATE TABLE IF NOT EXISTS code_access(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
    code VARCHAR(6) NOT NULL,
    state state_code NOT NULL DEFAULT 'PENDING' ,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_code_access_user_id ON code_access(user_id);

INSERT INTO roles (name, description) VALUES
    ('ADMIN',  'Administrador con acceso completo'),
    ('USER',   'Usuario habitual con acceso de solo lectura'),
    ('EDITOR', 'Editor con acceso de lectura y escritura');

INSERT INTO permissions (name, description) VALUES
    ('READ',         'Puede leer recursos'),
    ('WRITE',        'Puede escribir/crear recursos'),
    ('DELETE',       'Se pueden eliminar recursos'),
    ('MANAGE_USERS', 'Puede gestionar cuentas de usuario');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'ADMIN';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'USER' AND p.name = 'READ';

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'EDITOR' AND p.name IN ('READ', 'WRITE');

INSERT INTO users (email, full_name, type_document, document, phone, password_hash) VALUES
    ('yorluis.vega@wiedii.co',  'Yorluis Vega', 'C.C', '123456789', '(+57) 3214567890', 'ee026e71f8a07e1fbae00cbb26112aff9517600257ed26fcf03d278e50b61e2d'),
    ('luis.penaloza@wiedii.co',  'Alexander Peñaloza', 'C.C', '123456789', '(+57) 3214567890', 'ee026e71f8a07e1fbae00cbb26112aff9517600257ed26fcf03d278e50b61e2d'),
    ('freymar.sanchez@wiedii.co', 'Freymar Sanchez', 'C.C', '123456789', '(+57) 3214567890', 'ee026e71f8a07e1fbae00cbb26112aff9517600257ed26fcf03d278e50b61e2d'),
    ('josver.marquez@wiedii.co', 'Josver Marquez', 'C.C', '123456789', '(+57) 3214567890', 'ee026e71f8a07e1fbae00cbb26112aff9517600257ed26fcf03d278e50b61e2d'),
    ('monica.villegas@wiedii.co', 'Mónica Villegas', 'C.C', '123456789', '(+57) 3214567890', 'ee026e71f8a07e1fbae00cbb26112aff9517600257ed26fcf03d278e50b61e2d'),
    ('duban.marquez@wiedii.co', 'Duban Marquez', 'C.C', '123456789', '(+57) 3214567890', 'ee026e71f8a07e1fbae00cbb26112aff9517600257ed26fcf03d278e50b61e2d');

INSERT INTO user_roles (user_id, role_id) VALUES
    (1, (SELECT id FROM roles WHERE name = 'ADMIN')),
    (2, (SELECT id FROM roles WHERE name = 'USER')),
    (3, (SELECT id FROM roles WHERE name = 'ADMIN')),
    (4, (SELECT id FROM roles WHERE name = 'ADMIN')),
    (5, (SELECT id FROM roles WHERE name = 'USER')),
    (6, (SELECT id FROM roles WHERE name = 'EDITOR'));

INSERT INTO user_permissions (user_id, permission_id, granted, reason)
VALUES (
    (SELECT id FROM users WHERE email = 'monica.villegas@wiedii.co'),
    (SELECT id FROM permissions WHERE name = 'WRITE'),
    TRUE,
    'Colaborador invitado para el proyecto'
);

INSERT INTO user_permissions (user_id, permission_id, granted, reason)
VALUES (
    (SELECT id FROM users WHERE email = 'duban.marquez@wiedii.co'),
    (SELECT id FROM permissions WHERE name = 'WRITE'),
    FALSE,
    'Suspendido temporalmente'
);

CREATE TABLE IF NOT EXISTS refresh_tokens(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE RESTRICT,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATE NOT NULL DEFAULT NOW() + INTERVAL '7 days',
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);