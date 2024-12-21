import { isUserLoggedIn } from "../utility.js";

export default async function (req, res) {
    if (!isUserLoggedIn(req)) return res.status(400).end();
    
    req.session.regenerate((err) => {
        if (!err) return;
        console.error(err);
    });
}