const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  console.log('Logged In')
  User.findById('5f19b5ab78a28e28cea1081d')
    .then(user => {
      req.session.isLoggedIn = true
      req.session.user = user
      res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isLoggedIn
      });
      next()
    })
    .catch(err => console.log('user failure from db', err))

};

exports.postLogout = (req, res, next) => {
  console.log('Logged out')
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}
