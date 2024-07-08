import express from 'express';
import path from 'path';

const __public = path.join(import.meta.dirname, 'public');

const port = 3000;

const app = express();

app.use('/assets', express.static(path.join(__public, 'assets'), { index: false, }));

app.get('/', async (req, res) => {


    res.sendFile('login.html', { root: __public });
});

app.get('/sign-up', async (req, res) => {


    res.sendFile('sign-up.html', { root: __public });
});

app.listen(port, 'localhost', () => {
    console.log(`The server is now listening at port ${port}`);
});