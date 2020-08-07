const User = require('../models/user')
const bcrypt = require('bcryptjs')

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
      req.session.save(err => {
        console.log(err)
        res.redirect('/')
      })
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

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (!user) {
      console.log('new user')
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

        .then(foundUser => {
          res.redirect('/login')
        })
        .catch(err => {
          console.log(err)
          res.redirect('/signup')
        })
    }
    else {
      console.log('user already exists')
      res.redirect('/login')
    }
  })
};
