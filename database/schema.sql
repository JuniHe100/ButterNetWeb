CREATE TABLE IF NOT EXISTS accounts (
    account_id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    tokens INTEGER NOT NULL DEFAULT 1000,
    welcome_tokens_granted INTEGER NOT NULL DEFAULT 1,
    butternet_plus INTEGER NOT NULL DEFAULT 1,
    is_owner INTEGER NOT NULL DEFAULT 0,
    is_moderator INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS players (
    account_id TEXT PRIMARY KEY,
    display_name TEXT,
    tokens INTEGER NOT NULL DEFAULT 1000,
    inventory_json TEXT NOT NULL DEFAULT '[]',
    cosmetics_json TEXT NOT NULL DEFAULT '[]',
    dorm_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
    room_id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    server_id TEXT,
    photon_room TEXT,
    region TEXT NOT NULL DEFAULT 'us',
    max_players INTEGER NOT NULL DEFAULT 20,
    players INTEGER NOT NULL DEFAULT 0,
    published INTEGER NOT NULL DEFAULT 0,
    public INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS servers (
    server_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT 'us',
    room TEXT,
    online INTEGER NOT NULL DEFAULT 0,
    players INTEGER NOT NULL DEFAULT 0,
    max_players INTEGER NOT NULL DEFAULT 20,
    last_heartbeat TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS clubs (
    club_id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    icon TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS club_members (
    club_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    joined_at TEXT NOT NULL,
    PRIMARY KEY (club_id, account_id)
);

CREATE TABLE IF NOT EXISTS events (
    event_id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    room_id TEXT,
    start_time TEXT NOT NULL,
    end_time TEXT,
    max_players INTEGER NOT NULL DEFAULT 20,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS event_players (
    event_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    joined_at TEXT NOT NULL,
    PRIMARY KEY (event_id, account_id)
);

CREATE INDEX IF NOT EXISTS idx_rooms_public
ON rooms(published, public);

CREATE INDEX IF NOT EXISTS idx_servers_online
ON servers(online);

CREATE INDEX IF NOT EXISTS idx_events_start
ON events(start_time);

CREATE INDEX IF NOT EXISTS idx_club_members_account
ON club_members(account_id);
