CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id VARCHAR(30) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL
);