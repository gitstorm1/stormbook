import { db } from '../../db.js';

import bcrypt from 'bcrypt';

export default async function (req, res) {
    if (req.session.user) return res.status(400).end();

    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;
    const enteredUsername = req.body.username;

    // TO-DO: Add validation for email and username fields.

    // The functions will send a response automatically if validation is unsusccessful
    if (!validateEmail(email, res)) return;

    if (!validatePassword(email, res)) return;

    if (!validateUsername(email, res)) return;

    if (email.length < 3) {
        return res.send('Email is too short');
    }

    if (accountExistsOfEmail(enteredEmail)) {
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

    const queryResult = await db.one('INSERT INTO users(email, pwd_hash, username) VALUES($1, $2, $3) RETURNING id;', [email, pwdHash, username]);

    console.log('Created account:', queryResult.id);

    req.session.user = {
        id: queryResult.id,
    };

    res.redirect('/');
}

async function accountExistsOfEmail(email) {
    return (await db.oneOrNone('SELECT id FROM users WHERE email=$1 LIMIT 1', [email])) !== null;
}

function validateEmail(email, res) {
    return true;
}

function validatePassword(password, res) {
    return true;
}

function validateUsername(username, res) {
    return true;
}