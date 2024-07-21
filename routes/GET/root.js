import { __public } from '../../config.js';

export default async function(req, res) {
    if (!req.session.user) return res.redirect('/login');

    res.sendFile('home.html', { root: __public });
}