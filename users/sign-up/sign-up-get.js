import { __public } from '../../config.js';

export default async function(req, res) {
    if (req.session.user) return res.redirect('/');

    res.sendFile('sign-up.html', { root: __public });
}