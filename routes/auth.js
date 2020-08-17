const express = require('express');
const { check, body } = require('express-validator')

const authController = require('../controllers/auth');
const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    [
        check('email')
            .isEmail()
            .withMessage('Invalid email')
            .normalizeEmail(),

        body('password', 'password must be at least 6 characters and alphanumeric')
            .isLength({ min: 6 })
            .isAlphanumeric()
            .trim(),
    ],
    authController.postLogin);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Invalid email').custom((value, { req }) => {
                return User.findOne({ email: value })
                    .then(user => {
                        if (user) {
                           return Promise.reject('Email already exists, please try a different email')
                        }
                    })
            }).normalizeEmail(),

        body('password', 'password must be at least 6 characters and alphanumeric')
            .isLength({ min: 6 })
            .isAlphanumeric().trim(),

        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match')
            }
            return true
        }).trim()
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/new-password/:token', authController.getNewPassword)

router.get('/new-password', authController.getNewPassword)

router.post('/new-password', authController.postNewPassword)

module.exports = router;