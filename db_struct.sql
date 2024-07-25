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

    member1_id TEXT NOT NULL REFERENCES users(id),
    member2_id TEXT NOT NULL REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL
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