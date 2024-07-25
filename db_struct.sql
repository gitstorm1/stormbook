CREATE TABLE users (
    id TEXT PRIMARY KEY,

    email TEXT UNIQUE NOT NULL,
    pwd_hash TEXT UNIQUE NOT NULL,

    created_at TIMESTAMPTZ NOT NULL,

    username TEXT NOT NULL,

    pfp_url TEXT,

    about TEXT
);

CREATE TABLE friendships (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    user1_id TEXT NOT NULL REFERENCES users(id),
    user2_id TEXT NOT NULL REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE friend_requests (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    sender_id TEXT NOT NULL REFERENCES users(id),
    receiver_id TEXT NOT NULL REFERENCES users(id),

    sent_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    poster_id TEXT NOT NULL REFERENCES users(id),

    posted_at TIMESTAMPTZ NOT NULL,

    content TEXT NOT NULL
);

CREATE TABLE posts_likes (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    liker_id TEXT NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES posts(id)
);