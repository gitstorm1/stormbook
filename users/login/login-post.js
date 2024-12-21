import { db } from '../../db.js';

import bcrypt from 'bcrypt';

import { isUserLoggedIn, createSessionUserCache } from '../utility.js';

export default async function (req, res) {
    if (isUserLoggedIn(req)) return res.status(400).end();

    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;

    const accountIDAndHash = await getAccountIDAndHashFromEmail(enteredEmail);

    if (accountIDAndHash === null) {
        return res.status(404).send('No account of the specified email exists');
    }

    if (!(await isEnteredPasswordCorrect(enteredPassword, accountIDAndHash.pwd_hash))) {
        return res.status(401).send('Incorrect password');
    }

    logUserIn(req, accountIDAndHash.id);

    res.redirect('/');
}

async function logUserIn(req, userId) {
    createSessionUserCache(req, userId);

    console.log('Logged in successfully');
}

async function getAccountIDAndHashFromEmail(email) {
    return await db.oneOrNone('SELECT id, pwd_hash FROM users WHERE email=$1 LIMIT 1', [email]);
}

async function isEnteredPasswordCorrect(enteredPassword, passwordHash) {
    return await bcrypt.compare(enteredPassword, passwordHash);
}