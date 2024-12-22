import apiRouterV1 from './api-router.js';

/**
 * 
 * @param {import('express').Application} app 
 */
async function initialize(app) {
    app.use('/api/v1', apiRouterV1);
}

export default { initialize: initialize };