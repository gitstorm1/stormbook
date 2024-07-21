import { __public } from '../../config.js';

export default async function(req, res) {
    if (req.session.user) return res.redirect('/');

    res.sendFile('login.html', { root: __public });
}