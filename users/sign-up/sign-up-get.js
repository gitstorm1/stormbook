import { __public } from '../../config.js';

import { isUserLoggedIn } from '../utility.js';

export default async function(req, res) {
    if (isUserLoggedIn(req)) return res.redirect('/');

    res.sendFile('sign-up.html', { root: __public });
}