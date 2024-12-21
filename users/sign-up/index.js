async function initialize(app) {
    app.get('/sign-up', (await import('./sign-up-get.js')).default);
    app.post('/sign-up', (await import('./sign-up-post.js')).default);
}

export default { initialize: initialize };