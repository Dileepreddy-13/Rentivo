const express = require('express');
const router = express.Router({mergeParams: true});
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');



router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signup', wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        await User.register(user, password);
        req.flash('success', 'Welcome to Rentivo!');
        res.redirect('/listings');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash('success', 'Welcome back to Rentivo!');
    res.redirect('/listings');
});

module.exports = router;