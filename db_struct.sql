CREATE TABLE users (
    id TEXT PRIMARY KEY,

    email TEXT UNIQUE NOT NULL,
    pwd_hash TEXT NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    username TEXT NOT NULL,

    pfp_url TEXT,

    about TEXT
);

CREATE TABLE friendships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    user1_id TEXT NOT NULL,
    user2_id TEXT NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user1_id) REFERENCES users(id),
    FOREIGN KEY (user2_id) REFERENCES users(id)
);

CREATE TABLE friend_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    sender_id TEXT NOT NULL,
    receiver_id TEXT NOT NULL,

    sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    poster_id TEXT NOT NULL,

    posted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    content TEXT NOT NULL,

    FOREIGN KEY (poster_id) REFERENCES users(id)
);

CREATE TABLE posts_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    liker_id TEXT NOT NULL,
    post_id INTEGER NOT NULL,

    FOREIGN KEY (liker_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);