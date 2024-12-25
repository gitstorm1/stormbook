import { createApp } from './app.js';

(await import('dotenv')).config();

const app = createApp();

app.listen(process.env.PORT, 'localhost', () => {
    console.log(`The server is now listening at port ${process.env.PORT}`);
});