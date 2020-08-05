const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: isLoggedIn ? true: false
  });
};

exports.postLogin = (req, res, next) => {
  console.log('Logged In')
  User.findById('5f19b5ab78a28e28cea1081d')
    .then(user => {
      req.session.isLoggedIn = true
      req.user = user
      res.redirect('/')
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
