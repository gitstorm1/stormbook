import { db } from '../../db.js';

import bcrypt from 'bcrypt';

export default async function (req, res) {
    if (isUserLoggedIn(req)) return res.status(409).end();

    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;

    const accountIDAndHash = await getAccountIDAndHashFromEmail(enteredEmail);

    if (accountIDAndHash === null) {
        return res.status(404).send('No account of the specified email exists');
    }

    if (!(await isEnteredPasswordCorrect(enteredPassword, accountIDAndHash.pwd_hash))) {
        return res.status(401).send('Incorrect password');
    }

    createSessionUserCache(req, accountIDAndHash.id);

    console.log('Logged in successfully');

    res.redirect('/');
}

function isUserLoggedIn(req) {
    return (req.session.user !== undefined);
}

async function getAccountIDAndHashFromEmail(email) {
    return await db.oneOrNone('SELECT id, pwd_hash FROM users WHERE email=$1 LIMIT 1', [email]);
}

async function isEnteredPasswordCorrect(enteredPassword, passwordHash) {
    return await bcrypt.compare(enteredPassword, passwordHash);
}

function createSessionUserCache(req, userId) {
    req.session.user = {
        id: userId
    };
}