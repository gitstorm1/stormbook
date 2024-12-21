import { db } from '../../db.js';

import isEmail from "validator/lib/isEmail.js";

import bcrypt from 'bcrypt';

export default async function (req, res) {
    if (req.session.user) return res.status(400).end();

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

    const pwdHash = await bcrypt.hash(enteredPassword, 10);

    // https://i.sstatic.net/l60Hf.png DEFAULT PFP

    const queryResult = await db.one('INSERT INTO users(email, pwd_hash, username) VALUES($1, $2, $3) RETURNING id;', [enteredEmail, pwdHash, enteredUsername]);

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
        res.status(400).send("Username should be between 3 and 30 characters")
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