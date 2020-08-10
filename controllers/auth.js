const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')

const User = require('../models/user')
const { buffer } = require('mongoose/lib/utils')

const mailTransport = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
}))

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0]
  }
  else {
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
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
        mailTransport.sendMail({
          to: email,
          from: 'munisco12@gmail.com',
          subject: 'Successful sign up',
          html: '<h1>Welcome, you have signed Up successfully!!</h1>'

        }).then(result => {
          console.log('from the mailer', result)
        }).catch(err => console.log(err))
      })
  })
    .catch(err => {
      console.log(err)
      res.redirect('/signup')
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
    const token = crypto.randomBytes(32, (err, buffer) => {
      if (err) return console.log(err)
      return buffer.toString('hex')
    })

    mailTransport.sendMail({
      to: email,
      from: 'munisco12@gmail.com',
      subject: 'Reset Password',
      html: `<h3>You requested for a password change!!</h3>
            <p>If you want to proceed, please click on this link http://localhost/3030/reset/${token}</p>`
    })
  })
    .then(result => {
      console.log(result)
      req.flash('message', 'An email has been sent to you')
      return res.redirect('/reset')
    })
    .catch(err => console.log(err))

}
