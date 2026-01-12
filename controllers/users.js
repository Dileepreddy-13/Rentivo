const User = require('../models/user');

module.exports.signupForm = (req, res) => {
    res.render('users/signup');
}

module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body.user;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Rentivo!');
            res.redirect('/listings');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}

module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back to Rentivo!');
    res.redirect(res.locals.redirectUrl || '/listings');
}

module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged you out!');
        res.redirect('/listings');
    }
    );
}
