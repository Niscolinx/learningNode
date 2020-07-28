exports.getLogin = (req, res, next) => {

  console.log('The login page')
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login'
  });
};

exports.postLogin = (req, res, next) => {

  console.log('Post login page')
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login'
  });
};
