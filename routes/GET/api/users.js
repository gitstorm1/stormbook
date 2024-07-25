import express from 'express';

import { db } from '../../../db.js';

const usersRouter = express.Router();

const allowedFields = [
    'username', 'pfp_url', 'about',
];

usersRouter.get('/:userId/:field', async (req, res, next) => {
    if (!req.session.user) return res.end();

    const field = req.params.field;
    if (!allowedFields.includes(field)) return next();

    const queryResult = await db.oneOrNone(`SELECT ${field} FROM users WHERE id=$1 LIMIT 1;`, req.params.userId);
    if (!queryResult) return res.end();

    res.send(queryResult[field]);
});

usersRouter.get('/:userId/friends-list', async (req, res) => {
    if (!req.session.user) return res.end();

    const queryResult = await db.manyOrNone('SELECT member1_id, member2_id, created_at FROM friendships WHERE (member1_id=$1 OR member2_id=$1);', req.params.userId);

    res.send(queryResult);
});

export default usersRouter