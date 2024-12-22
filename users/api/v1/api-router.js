import express from 'express';

import usersRouter from './users-router.js';

const apiRouterV1 = express.Router();

apiRouterV1.use('/users', usersRouter);

export default apiRouterV1;