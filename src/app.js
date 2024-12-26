import express from 'express';

import bcrypt from 'bcrypt';

export function createApp(database) {
    const app = express();

    app.use(express.json());

    app.post('/api/users/auth/login', async (req, res) => {
        const enteredEmail = req.body.email;
        const enteredPassword = req.body.password;

        const accountIdAndHash = database.getAccountIdAndHashFromEmail(enteredEmail);

        const accountExists = (accountIdAndHash !== null);

        if (!accountExists) {
            return res.status(401).send('Incorrect email');
        }

        if (!(await bcrypt.compare(enteredPassword, accountIdAndHash.pwd_hash))) {
            return res.status(401).send('Incorrect password');
        }

        console.log("User logged in");

        res.json({});
        //res.redirect('/');
    });

    return app;
}