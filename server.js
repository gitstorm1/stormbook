"use strict";

import dotenv from 'dotenv';
import path from 'path';

import express from 'express';

import PGP from 'pg-promise';
import expressSession from 'express-session';
import connectPgSimple from 'connect-pg-simple';

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const __public = path.join(import.meta.dirname, 'public');

const app = express();

const pgp = PGP();
const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

app.use('/assets', express.static(path.join(__public, 'assets'), { index: false, }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        
        resave: false,
        saveUninitialized: false,

        store: new ( connectPgSimple(expressSession) ) ({
            pgPromise: db,
        }),

        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

app.get('/login', async (req, res) => {
    if (req.session.user) return res.redirect('/');

    res.sendFile('login.html', { root: __public });
});

app.get('/sign-up', async (req, res) => {
    if (req.session.user) return res.redirect('/');

    res.sendFile('sign-up.html', { root: __public });
});

app.get('/', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    res.sendFile('home.html', { root: __public });
});

app.post('/logout', async (req, res) => {
    if (!req.session.user) return res.end();

    req.session.regenerate((err) => {
        if (!err) return;
        console.error(error);
    });
});

app.post('/login', async (req, res) => {
    if (req.session.user) return res.end();

    const email = req.body.email;
    const password = req.body.password;

    const userData = await db.oneOrNone('SELECT id, user_id, pwd_hash FROM users WHERE email=$1 LIMIT 1', [email]);

    if (userData === null) {
        return res.send('No account of the specified email exists');
    }

    const correctPassword = await bcrypt.compare(password, userData.pwd_hash);

    if (!correctPassword) {
        return res.send('Incorrect password');
    }

    req.session.user = {
        id: userData.id,
        user_id: userData.user_id,
    };

    console.log('Logged in successfully');

    res.redirect('/');
});

app.post('/sign-up', async (req, res) => {
    if (req.session.user) return res.end();

    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    // TO-DO: Add validation for email and username fields.

    if (email.length < 3) {
        return res.send('Email is too short');
    }

    const existing = await db.oneOrNone('SELECT id FROM users WHERE email=$1 LIMIT 1', [email]);
    
    if (existing !== null) {
        return res.send('An account already exists of the specified email');
    }

    if (email.length > 254) {
        return res.send('Email is too long');
    }

    if (password.length < 8) {
        return res.send('Password must be at least 8 characters long');
    }

    if (username.length < 3) {
        return res.send('Username is too short');
    }

    if (username.length > 36) {
        return res.send('Username is too long');
    }

    const pwdHash = await bcrypt.hash(req.body.password, 10);

    // https://i.sstatic.net/l60Hf.png DEFAULT PFP

    const userId = uuidv4();
    const createdAt = (Date.now() / 1000.0);

    const result = await db.one('INSERT INTO users(user_id, email, pwd_hash, created_at, username) VALUES($1, $2, $3, TO_TIMESTAMP($4), $5) RETURNING id;', [userId, email, pwdHash, createdAt, username]);

    console.log('Created account:', result.id);

    req.session.user = {
        id: result.id,
        user_id: userId,
    };

    res.redirect('/');
});

app.listen(process.env.PORT, 'localhost', () => {
    console.log(`The server is now listening at port ${process.env.PORT}`);
});