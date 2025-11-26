import { db } from '../../db.js';

import isEmail from "validator/lib/isEmail.js";

import bcrypt from 'bcrypt';

import { randomUUID } from 'crypto';

import { isUserLoggedIn, createSessionUserCache } from '../utility.js';

export default async function (req, res) {
    if (isUserLoggedIn(req)) return res.status(400).end();

    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;
    const enteredUsername = req.body.username;

    // The functions will send a response automatically if validation is unsusccessful
    if (!validateEmail(enteredEmail, res)) return;

    if (await accountExistsOfEmail(enteredEmail)) {
        return res.status(409).send('An account with this email already exists');
    }

    if (!validatePassword(enteredPassword, res)) return;

    if (!validateUsername(enteredUsername, res)) return;

    await createUserAccount(req, enteredEmail, enteredPassword, enteredUsername);

    res.redirect('/');
}

async function createUserAccount(req, enteredEmail, enteredPassword, enteredUsername) {
    const pwdHash = await bcrypt.hash(enteredPassword, 10);

    const newUserId = randomUUID();

    await db.none(
        'INSERT INTO users(id, email, pwd_hash, username) VALUES(?, ?, ?, ?);',
        [newUserId, enteredEmail, pwdHash, enteredUsername]
    );

    console.log('Created account:', newUserId);

    createSessionUserCache(req, newUserId);

    // https://i.sstatic.net/l60Hf.png DEFAULT PFP
}

async function accountExistsOfEmail(email) {
    return (await db.oneOrNone('SELECT id FROM users WHERE email = ? LIMIT 1;', [email])) !== null;
}

function validateEmail(email, res) {
    if (!isEmail(email)) {
        res.status(400).send("Invalid email");
        return false;
    }
    return true;
}

function validatePassword(password, res) {
    if (password.length < 8) {
        res.status(400).send('Password must be at least 8 characters long');
        return false;
    }
    return true;
}

function validateUsername(username, res) {
    if ((username.length < 3) || (username.length > 30)) {
        res.status(400).send("Username should be between 3 and 30 characters");
        return false;
    }

    const regex = /^[a-zA-Z0-9 _]+$/;

    if (!regex.test(username)) {
        res.status(400).send("Username can only contain letters, numbers, underscores, and spaces");
        return false;
    }

    if (username.includes('__')) {
        res.status(400).send("Username cannot contain consecutive underscores");
        return false;
    }

    if (username.includes('  ')) {
        res.status(400).send("Username cannot contain consecutive spaces");
        return false;
    }

    if (username.includes(' _') || username.includes('_ ')) {
        res.status(400).send("Username cannot contain adjacent space and underscore");
        return false;
    }

    return true;
}