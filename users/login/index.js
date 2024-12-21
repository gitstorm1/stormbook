async function initialize(app) {
    app.get('/login', (await import('./login-get.js')).default);
    app.post('/login', (await import('./login-post.js')).default);

    app.get('/logout', (await import('./logout-get.js')).default)
}

export default { initialize: initialize };