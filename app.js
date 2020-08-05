const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const session = require('express-session')
const mongoDbSession = require('connect-mongodb-session')(session)

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/user')

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const MONGODB_URI = 'mongodb+srv://munisco:fkNZcq4s9ZmcXho5@cluster0.zhgsa.mongodb.net/shop'

const store = new mongoDbSession({
    uri: MONGODB_URI,
    collection: 'sessions'
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store}))


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        console.log('connected to the client')

        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Collins', email: 'munisco12@gmail.com', cart: {
                        items: []
                    }
                })
                user.save()
            }
        })

        app.listen(3030, () => {
            console.log('Listening on 3030')
        })
    }).catch(err => console.log(err))


