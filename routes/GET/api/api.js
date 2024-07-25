import express from 'express';

const apiRouter = express.Router();

apiRouter.get('/my-user-id', async (req, res) => {
    if (!req.session.user) return res.end();
    res.send(req.session.user.id);
});

apiRouter.use('/users', (await import('./users.js')).default);

export default apiRouter