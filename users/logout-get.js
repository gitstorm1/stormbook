async function logoutHandler(req, res) {
    if (!req.session.user) return res.status(401).end();
    
    req.session.regenerate((err) => {
        if (!err) return;
        console.error(err);
    });
}

async function initialize(app) {
    app.post('/logout', logoutHandler);
}

export default { initialize: initialize };