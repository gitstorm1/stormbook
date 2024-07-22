import { db } from '../../db.js';

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export default async function (req, res) {
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

    const queryResult = await db.one('INSERT INTO users(user_id, email, pwd_hash, created_at, username) VALUES($1, $2, $3, TO_TIMESTAMP($4), $5) RETURNING id;', [userId, email, pwdHash, createdAt, username]);

    console.log('Created account:', queryResult.id);

    req.session.user = {
        id: queryResult.id,
        user_id: userId,
    };

    res.redirect('/');
}