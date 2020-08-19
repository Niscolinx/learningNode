const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const mongoDbSession = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const User = require('./models/user')

const errorController = require('./controllers/error')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const MONGODB_URI =
    'mongodb+srv://munisco:fkNZcq4s9ZmcXho5@cluster0.zhgsa.mongodb.net/shop'
const csrfToken = csrf()

const store = new mongoDbSession({
    uri: MONGODB_URI,
    collection: 'sessions',
})

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store,
    })
)
app.use(csrfToken)
app.use(flash())

app.use((req, res, next) => {

    res.locals.isAuthenticated = req.session.isLoggedIn,
        res.locals.csrfToken = req.csrfToken()
    next()
})

app.use((req, res, next) => {
    if (!req.session.user) return next()
    User.findById(req.session.user._id)
        .then((user) => {
            throw new Error('Dummy Error')
            if (!user) return next()
            req.user = user
            next()
        })
        .catch((err) => {
            return next(new Error(err))
        })
})


app.use(shopRoutes)
app.use('/admin', adminRoutes)
app.use(authRoutes)

app.use(errorController.get404)

app.use((err, req, res, next) => {
    if (err) {
        res.status(500).render('500', {
            pageTitle: 'Server Error',
            path: '/500'
        })
    }
})
mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => {
        console.log('connected to the client')

        app.listen(3030, () => {
            console.log('Listening on 3030')
        })
    })
    .catch(err => {
        const error = new Error(err)
        error.httpStatus = 500
        return next(error)
    })