module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn && (req.url != '/login')){
        return res.redirect('/login')
    }
    next()
}