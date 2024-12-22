import apiV1Module from "./v1/index.js";

/**
 * 
 * @param {import('express').Application} app 
 */
async function initialize(app) {
    apiV1Module.initialize(app);
}

export default { initialize: initialize };