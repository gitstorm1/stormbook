import express from 'express';

import { db } from '../../../db.js';

const usersRouter = express.Router();

const allowedFields = [
    'username', 'pfp_url', 'about',
];

usersRouter.get('/:userId/:field', async (req, res, next) => {
    if (!req.session.user) return res.status(401).end();

    const field = req.params.field;
    if (!allowedFields.includes(field)) return next();

    let queryResult;

    try {
        queryResult = await db.oneOrNone(`SELECT ${field} FROM users WHERE id=$1 LIMIT 1;`, [req.params.userId]);
    } catch (err) {
        return res.status(400).end();
    }

    if (!queryResult) return res.end();

    res.send(queryResult[field]);
});

usersRouter.get('/:userId/friends-list', async (req, res) => {
    if (!req.session.user) return res.status(401).end();

    let queryResult;
    
    try {
        queryResult = await db.manyOrNone('SELECT user1_id, user2_id, created_at FROM friendships WHERE (user1_id=$1 OR user2_id=$1);', [req.params.userId]);
    } catch (err) {
        return res.status(400).end();
    }

    const friendsList = [];

    for (const row of queryResult) {
        const friendId = ((row.user1_id === req.params.userId) ? row.user2_id : row.user1_id);

        const userInfoQuery = await db.one('SELECT username, pfp_url FROM users WHERE id=$1', [friendId]);

        friendsList.push({
            friendId: friendId,
            createdAt: row.created_at,
            username: userInfoQuery.username,
            pfpUrl: userInfoQuery.pfp_url,
        });
    }

    res.send(friendsList);
});

usersRouter.get('/:userId/friend-requests/incoming', async (req, res) => {
    if ((!req.session.user) || ((req.params.userId !== req.session.user.id))) return res.status(401).end();

    const queryResult = await db.manyOrNone('SELECT sender_id, sent_at FROM friend_requests WHERE receiver_id=$1;', [req.session.user.id]);

    const incomingFriendRequests = [];

    for (const row of queryResult) {
        const userInfoQuery = await db.one('SELECT username, pfp_url FROM users WHERE id=$1', [row.sender_id]);
        incomingFriendRequests.push({
            senderId: row.sender_id,
            sentAt: row.sent_at,
            username: userInfoQuery.username,
            pfpUrl: userInfoQuery.pfp_url,
        });
    }

    res.send(incomingFriendRequests);
});

usersRouter.get('/:userId/friend-requests/outgoing', async (req, res) => {
    if ((!req.session.user) || ((req.params.userId !== req.session.user.id))) return res.status(401).end();

    const queryResult = await db.manyOrNone('SELECT receiver_id, sent_at FROM friend_requests WHERE sender_id=$1;', [req.session.user.id]);

    const outgoingFriendRequests = [];

    for (const row of queryResult) {
        const userInfoQuery = await db.one('SELECT username, pfp_url FROM users WHERE id=$1', [row.receiver_id]);
        outgoingFriendRequests.push({
            receiverId: row.receiver_id,
            sentAt: row.sent_at,
            username: userInfoQuery.username,
            pfpUrl: userInfoQuery.pfp_url,
        });
    }

    res.send(outgoingFriendRequests);
});

export default usersRouter;