// Check if the user in an express session is logged in
export function isUserLoggedIn(req) {
    return (req.session.user !== undefined);
}

// Creates the session cache indicating to Express middleware that the user is logged in,
// along with identification information
export function createSessionUserCache(req, userId) {
    req.session.user = {
        id: userId
    };
}