CREATE TABLE IF NOT EXISTS accounts (
    account_id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    tokens INTEGER NOT NULL DEFAULT 1000,
    welcome_tokens_granted INTEGER NOT NULL DEFAULT 1,
    butternet_plus INTEGER NOT NULL DEFAULT 1,
    is_owner INTEGER NOT NULL DEFAULT 0,
    is_moderator INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
    room_id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    published INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servers (
    server_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    room_id TEXT,
    region TEXT DEFAULT 'us',
    photon_app_id TEXT,
    online INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_accounts_username
ON accounts(username);

CREATE INDEX IF NOT EXISTS idx_sessions_account
ON sessions(account_id);

CREATE INDEX IF NOT EXISTS idx_rooms_owner
ON rooms(owner_id);

CREATE INDEX IF NOT EXISTS idx_servers_room
ON servers(room_id);
