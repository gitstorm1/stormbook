import { createApp } from './app.js';

import * as database from './database.js';

(await import('dotenv')).config();

const sessionMiddleware = database.createSessionMiddleware();

const app = createApp(database, sessionMiddleware);

app.listen(process.env.PORT, 'localhost', () => {
    console.log(`The server is now listening at port ${process.env.PORT}`);
});