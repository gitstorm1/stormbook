import express from 'express';

import { db } from '../../../db.js';

const router = express.Router();

router.get('/username', async (req, res) => {
    if (!req.session.user) return res.end();

    const queryResult = await db.one('SELECT username FROM users WHERE id=$1 LIMIT 1;', req.session.user.id);

    res.send(queryResult.username);
});

router.get('/pfp-url', async (req, res) => {
    if (!req.session.user) return res.end();

    const queryResult = await db.one('SELECT pfp_url FROM users WHERE id=$1 LIMIT 1;', req.session.user.id);

    res.send(queryResult.pfp_url);
});

router.get('/about', async (req, res) => {
    if (!req.session.user) return res.end();

    const queryResult = await db.one('SELECT about FROM users WHERE id=$1 LIMIT 1;', req.session.user.id);

    res.send(queryResult.about);
});

router.get('/friends-list', async (req, res) => {
    if (!req.session.user) return res.end();

    // const queryResult = await db.one('SELECT about FROM users WHERE id=$1 LIMIT 1;', req.session.user.id);

    res.send('Not Implemented');
});

export default router