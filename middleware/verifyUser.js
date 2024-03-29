const isAuth = (req, res, next) => {
    if (req.session.isAuth && req.session.user) {
        req.user = req.session.user; // Populate req.user with user information
        next();
    } else {
        res.redirect('/login');
    }
};

module.exports = isAuth;
