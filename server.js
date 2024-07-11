import dotenv from 'dotenv';
import path from 'path';

import express from 'express';
import PGP from 'pg-promise';

dotenv.config();

const __public = path.join(import.meta.dirname, 'public');

const app = express();

const pgp = PGP();
const db = pgp({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

app.use('/assets', express.static(path.join(__public, 'assets'), { index: false, }));

app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {


    res.sendFile('login.html', { root: __public });
});

app.get('/sign-up', async (req, res) => {


    res.sendFile('sign-up.html', { root: __public });
});

app.post('/sign-up', async (req, res) => {
    console.log(req.body, req);
    res.redirect('/');
});

app.listen(process.env.PORT, 'localhost', () => {
    console.log(`The server is now listening at port ${process.env.PORT}`);
});