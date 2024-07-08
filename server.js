import express from 'express';
import path from 'path';

const __public = path.join(import.meta.dirname, 'public');

const port = 3000;

const app = express();

app.use('/', express.static(__public, { index: false, }));

app.get('/', (req, res) => {
    res.sendFile('login-page.html', { root: __public });
});

app.listen(port, 'localhost', () => {
    console.log(`The server is now listening at port ${port}`);
});