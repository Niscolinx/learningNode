exports.getLogin = (req, res, next) => {

  console.log('the request is', req.get('Cookie'))
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login'
  });
};

exports.postLogin = (req, res, next) => {

 res.setHeader('Set-Cookie', 'loggedIn=true')
 res.redirect('/login')
};
