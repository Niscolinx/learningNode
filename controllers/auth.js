const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: req.flash('error')
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body

  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'User does not exist, please sign up')
        return res.redirect('/signup')
      }
      bcrypt.compare(password, user.password)
        .then(doesMatch => {
          if (doesMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            req.session.save(err => {
              console.log(err)
              res.redirect('/')
            })
          }
          else {
            req.flash('error', 'wrong password or email')
            res.redirect('/login')
          }
        })
    })
    .catch(err => {
      console.log('Failed to user in', err)
    })

};

exports.postLogout = (req, res, next) => {
  console.log('Logged out')
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (user) {
      req.flash('error', 'User already exits, please login!!')
      return res.redirect('/login')
    }
    bcrypt.hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          email,
          password: hashedPassword,
          cart: {
            items: []
          }
        })
        return user.save()
      })
      .then(newUser => {
        res.redirect('/login')
      })
  })
    .catch(err => {
      console.log(err)
      res.redirect('/signup')
    })

};
