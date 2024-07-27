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
});

apiRouter.post('/decline-friend-request', async (req, res) => {
    /*
    
    Validation
        Same as the above
    
    Remove from database friend_requests
        Match sender and receiver
    
    Respond with success

    */
});

export default apiRouter;