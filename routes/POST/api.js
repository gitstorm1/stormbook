import express from 'express';

import { db } from '../../db.js';

const apiRouter = express.Router();

apiRouter.post('/send-friend-request', async (req, res) => {
    /*
    
    Validation
        User is not trying to friend itself
        Friend request does not already exist (either way)
        If any of these fail, respond with failure
    
    Add to database friend_requests
        sender_id = req.user.session.id
        receiver_id = what the user sent
    
    Respond with success

    */
    
    if (!req.session.user) return res.status(401).end();

    const targetId = req.body.targetId;

    if ((!targetId) || (targetId === req.session.user.id)) return res.status(400).end();

    try {
        const queryResult = await db.oneOrNone(
            'SELECT id FROM friendships WHERE ((user1_id=$1 AND user2_id=$2) OR (user1_id=$2 AND user2_id=$1));',
            [req.session.user.id, targetId,]
        );
        if (queryResult) return res.status(400).end();
    } catch(err) {
        console.error(err);
        return res.status(400).end();
    }

    try {
        const queryResult = await db.oneOrNone(
            'SELECT id FROM friend_requests WHERE ((sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1));',
            [req.session.user.id, targetId,]
        );
        if (queryResult) return res.status(400).end();
    } catch(err) {
        console.error(err);
        return res.status(400).end();
    }

    try {
        await db.none(
            'INSERT INTO friend_requests(sender_id, receiver_id) VALUES($1, $2);',
            [req.session.user.id, targetId,]
        );
    } catch(err) {
        console.error(err);
        return res.status(400).end();
    }

    console.log(`Sent friend request successfully of user ${req.session.user.id} to ${targetId}`);
    
    res.end();
});

apiRouter.post('/accept-friend-request', async (req, res) => {
    /*
    
    Validation
        Friend request from the specified user exists
        Correct sender and receiver
        If any of these fail, respond with failure
    
    Add to database friendships
        user1_id = req.user.session.id
        user2_id = what the user sent
    
    Remove from database friend_requests
        Match sender and receiver
    
    Respond with success

    */

    if (!req.session.user) return res.status(401).end();

    const senderId = req.body.senderId;

    if ((!senderId) || (senderId === req.session.user.id)) return res.status(400).end();

    try {
        const queryResult = await db.oneOrNone(
            'SELECT id FROM friend_requests WHERE (receiver_id=$1 AND sender_id=$2);',
            [req.session.user.id, senderId,]
        );
        if (!queryResult) return res.status(400).end();
    } catch(err) {
        console.error(err);
        return res.status(400).end();
    }

    await db.none(
        'INSERT INTO friendships(user1_id, user2_id) VALUES($1, $2);',
        [req.session.user.id, senderId,]
    );

    await db.none(
        'DELETE FROM friend_requests WHERE (receiver_id=$1 AND sender_id=$2);',
        [req.session.user.id, senderId,],
    );

    console.log(`User ${req.session.user.id} accepted the friend request of user ${senderId}`);

    res.end();
});

apiRouter.post('/decline-friend-request', async (req, res) => {
    /*
    
    Validation
        Same as the above
    
    Remove from database friend_requests
        Match sender and receiver
    
    Respond with success

    */

    if (!req.session.user) return res.status(401).end();

    const senderId = req.body.senderId;

    if ((!senderId) || (senderId === req.session.user.id)) return res.status(400).end();

    try {
        const queryResult = await db.oneOrNone(
            'SELECT id FROM friend_requests WHERE (receiver_id=$1 AND sender_id=$2);',
            [req.session.user.id, senderId,]
        );
        if (!queryResult) return res.status(400).end();
    } catch(err) {
        console.error(err);
        return res.status(400).end();
    }

    await db.none(
        'DELETE FROM friend_requests WHERE (receiver_id=$1 AND sender_id=$2);',
        [req.session.user.id, senderId,],
    );

    console.log(`User ${req.session.user.id} declined the friend request of user ${senderId}`);

    res.end();
});

apiRouter.post('/create-post', async (req, res) => {
    if (!req.session.user) return res.status(401).end();

    /*
    
    Validation
        Content is provided
        Content is at least 8 characters
        Respond with failure if not valid
    
    Add to database
        Add to posts table with contents field
    
    Respond with success

    */

    const content = req.body.content;
    if ((!content) || (content.length < 8)) return res.status(400).end();

    try {
        await db.none(
            'INSERT INTO posts(poster_id, content) VALUES($1, $2);',
            [req.session.user.id, content]
        );
    } catch(err) {
        console.error(err);
        return res.status(400).end();
    }

    console.log(`User ${req.session.user.id} created a post with content: ${content}`);

    res.end();
});

apiRouter.post('/delete-post', async (req, res) => {
    if (!req.session.user) return res.status(401).end();

    /*
        Post id
        Check if post id and poster id match
        Result should be one or none
        If found then delete  
    */

    if ((!req.params.postId) || (typeof req.params.postId !== 'number')) return res.status(400).end();

    const queryResult = db.oneOrNone(
        'SELECT id FROM posts WHERE (id=$1 AND poster_id=$2);',
        [req.params.postId, req.session.user.id],
    );

    if (queryResult) {
        await db.none(
            'DELETE FROM posts WHERE id=$1;',
            [req.params.postId],
        );
    }

    res.end();
});

apiRouter.post('/like-post-toggle', async (req, res) => {
    if (!req.session.user) return res.status(401).end();

    if ((!req.params.postId) || (typeof req.params.postId !== 'number')) return res.status(400).end();

    /*
        WHERE TO CONTINUE: INTERFACE FOR THESE TWO FUNCTIONS ON CLIENT AND FINISH THIS ONE
    */
});

export default apiRouter;