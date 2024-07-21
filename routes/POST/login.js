export default async function (req, res) {
    if (req.session.user) return res.end();

    const email = req.body.email;
    const password = req.body.password;

    const userData = await db.oneOrNone('SELECT id, user_id, pwd_hash FROM users WHERE email=$1 LIMIT 1', [email]);

    if (userData === null) {
        return res.send('No account of the specified email exists');
    }

    const correctPassword = await bcrypt.compare(password, userData.pwd_hash);

    if (!correctPassword) {
        return res.send('Incorrect password');
    }

    req.session.user = {
        id: userData.id,
        user_id: userData.user_id,
    };

    console.log('Logged in successfully');

    res.redirect('/');
}