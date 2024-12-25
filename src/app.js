import express from 'express';

export function createApp(database) {
    const app = express();

    app.post('/api/users/auth/login', async (req, res) => {
        res.json({});
    });

    return app;
}