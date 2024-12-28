import express from 'express';

import bcrypt from 'bcrypt';

export function createApp(database, sessionMiddleware, utility) {
    const app = express();

    app.use(express.json());

    app.use(sessionMiddleware);

    app.post('/api/v1/users/auth/login', async (req, res) => {
        if (req.session.user) {
            return res.status(400).json({message: 'User is already logged in'});
        }

        const enteredEmail = req.body.email;
        const enteredPassword = req.body.password;

        const accountIdAndHash = await database.getAccountIdAndHashFromEmail(enteredEmail);

        const accountExists = (accountIdAndHash !== null);

        if (!accountExists) {
            return res.status(401).json({message: 'Incorrect email'});
        }

        if (!(await bcrypt.compare(enteredPassword, accountIdAndHash.pwd_hash))) {
            return res.status(401).json({message: 'Incorrect password'});
        }

        req.session.user = {
            id: accountIdAndHash.id,
        };
        
        res.redirect('/');
    });

    app.post('/api/v1/users/auth/sign-up', async (req, res) => {
        if (req.session.user) {
            return res.status(400).json({message: 'User is already logged in'});
        }

        const enteredEmail = req.body.email;
        const enteredPassword = req.body.password;
        const enteredUsername = req.body.username;

        if (!utility.validate.email(enteredEmail)) {
            return res.status(400).json({message: 'Invalid email'});
        }

        if (!utility.validate.password(enteredPassword)) {
            return res.status(400).json({message: 'Invalid password'});
        }

        if (!utility.validate.username(enteredUsername)) {
            return res.status(400).json({message: 'Invalid username'});
        }

        if ((await database.getAccountIdAndHashFromEmail(enteredEmail)) !== null) {
            return res.status(409).json({message: 'An account with this email already exists'});
        }

        res.redirect('/');
    });

    return app;
}