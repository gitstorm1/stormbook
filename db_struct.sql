CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email TEXT UNIQUE NOT NULL,
    pwd_hash TEXT UNIQUE NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,

    username TEXT NOT NULL,

    pfp_url TEXT,

    about TEXT
);

CREATE TABLE friendships (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    user1_id UUID NOT NULL REFERENCES users(id),
    user2_id UUID NOT NULL REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

CREATE TABLE friend_requests (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    sender_id UUID NOT NULL REFERENCES users(id),
    receiver_id UUID NOT NULL REFERENCES users(id),

    sent_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    poster_id UUID NOT NULL REFERENCES users(id),

    posted_at TIMESTAMPTZ NOT NULL DEFAULT current_timestamp,

    content TEXT NOT NULL
);

CREATE TABLE posts_likes (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

    liker_id UUID NOT NULL REFERENCES users(id),
    post_id INTEGER NOT NULL REFERENCES posts(id)
);