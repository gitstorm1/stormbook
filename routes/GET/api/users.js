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

    const queryResult = await db.manyOrNone('SELECT user1_id, user2_id, created_at FROM friendships WHERE (user1_id=$1 OR user2_id=$1);', req.params.userId);

    const friendsList = queryResult.map((row) => {
        return {
            friendId: ((row.user1_id === req.params.userId) ? row.user2_id : row.user1_id),
            createdAt: row.created_at,
        };
    });

    res.send(friendsList);
});

usersRouter.get('/:userId/friend-requests/incoming', async (req, res) => {
    if ((!req.session.user) || ((req.params.userId !== req.session.user.id))) return res.end();

    const queryResult = await db.manyOrNone('SELECT sender_id, sent_at FROM friend_requests WHERE receiver_id=$1;', req.session.user.id);

    res.send(queryResult);
});

export default usersRouter;