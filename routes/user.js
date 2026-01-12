const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middlewares');
const { userSchema } = require('../schema');
const ExpressError = require('../utils/ExpressError');
const userController = require('../controllers/users');

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }
    next();
};

router.get('/signup', userController.signupForm);

router.post('/signup', validateUser, wrapAsync(userController.signup));

router.get('/login', userController.loginForm);

router.post('/login', saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.login));

router.get('/logout', userController.logout);

module.exports = router;