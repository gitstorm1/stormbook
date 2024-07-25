import { db } from '../../db.js';

import bcrypt from 'bcrypt';

export default async function (req, res) {
    if (req.session.user) return res.end();

    const email = req.body.email;
    const password = req.body.password;

    const queryResult = await db.oneOrNone('SELECT id, pwd_hash FROM users WHERE email=$1 LIMIT 1', [email]);

    if (queryResult === null) {
        return res.send('No account of the specified email exists');
    }

    const correctPassword = await bcrypt.compare(password, queryResult.pwd_hash);

    if (!correctPassword) {
        return res.send('Incorrect password');
    }

    req.session.user = {
        id: queryResult.id,
    };

    console.log('Logged in successfully');

    res.redirect('/');
}