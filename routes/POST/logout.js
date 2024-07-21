export default async function (req, res) {
    if (!req.session.user) return res.end();
    
    req.session.regenerate((err) => {
        if (!err) return;
        console.error(err);
    });
}