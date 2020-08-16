const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { validationResult } = require('express-validator')

const User = require('../models/user')

const mailTransport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'ede59559c58636',
    pass: 'ae32b40b8df082'
  }
})

exports.getLogin = (req, res, next) => {
  let message = req.flash('message');
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
    }
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
      }
    });
  }
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('message', 'User does not exist, please sign up')
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
            req.flash('message', 'wrong password or email')
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
  let message = req.flash('message');
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    }, 
    validationError: []
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log('the validation err', errors.array())
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email,
        password,
        confirmPassword
      }, 
      validationError: errors.array()[0]
    });
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
    }).catch(err => { console.log(err) })

  res.status(422).render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: errors.array()[0].msg,
    oldInput: {
      email,
      password,
    },
    validationError: errors.array()[0]
  });
  mailTransport.sendMail({
    to: email,
    from: 'munisco12@gmail.com',
    subject: 'Successful sign up',
    html: '<h1>Welcome, you have signed Up successfully!!</h1>'

      .then(result => {
        console.log('from the mailer', result)
      })
      .catch(err => console.log(err))

  })
    .catch(err => {
      console.log(err)
       res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg,
        oldInput: {
          email,
          password,
          confirmPassword
        },
        validationError: errors.array()[0]
      });
    })

};

exports.getReset = (req, res, next) => {
  let message = req.flash('message');
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
}

exports.postReset = (req, res, next) => {
  const { email } = req.body

  User.findOne({ email }).then(user => {
    if (!user) {

      req.flash('message', 'Email does not exist')
      return res.redirect('/reset')
    }
    return crypto.randomBytes(32, (err, buffer) => {
      if (err) return console.log(err)
      const token = buffer.toString('hex')

      user.password_resetToken = token
      user.password_resetToken_expiration = Date.now() + 3600000

      return user.save()
        .then(updatedUser => {

          mailTransport.sendMail({
            to: updatedUser.email,
            from: 'munisco12@gmail.com',
            subject: 'Reset Password from Node Shop',
            html: `<h3>You requested for a password change!!</h3>
            <p>If you want to proceed, please click on this <a href='http://localhost:3030/new-password/${token}'>link</a></p>`
          })
            .then(result => {
              req.flash('message', 'An email has been sent to you')
              res.redirect('/reset')
            })
        })
        .catch(err => console.log(err))
    })
  })
    .catch(err => console.log(err))
}

exports.getNewPassword = (req, res, next) => {

  const { token } = req.params

  let message = req.flash('message');
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null
  }
  res.render('auth/new-password', {
    path: '/new-password',
    pageTitle: 'New Password',
    errorMessage: message,
    token
  });
}
exports.postNewPassword = (req, res, next) => {
  const { password, token } = req.body


  User.findOne({ password_resetToken: token, password_resetToken_expiration: { $gt: Date.now() } })
    .then(user => {
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          user.password = hashedPassword
          user.password_resetToken = undefined
          user.password_resetToken_expiration = undefined
          return user.save()
        })
        .then(updatedPassword => {
          req.flash('message', 'Password has been updated Successfully')
          res.redirect('/login')

          mailTransport.sendMail({
            to: updatedPassword.email,
            from: 'munisco12@gmail.com',
            subject: 'Your password has been updated successfully',
            html: `<h3>You have successfully updated your password, click <a href='http://localhost:3030/login'>here to login</a></h3>`
          })
            .then(result => {
              console.log('sent updated password email', result)
            })
            .catch(err => console.log(err))

        }).catch(err => { console.log(err) })
    })
    .catch(err => {
      console.log(err)
      res.redirect('/reset')
    })
}