const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models/user')


const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const mongoose = require('mongoose')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    User.findById('5f19b5ab78a28e28cea1081d')
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log('user failure from db', err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);


mongoose.connect('mongodb+srv://munisco:fkNZcq4s9ZmcXho5@cluster0.zhgsa.mongodb.net/shop', { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
    console.log('connected to the client')

    User.findOne().then(user => {
        if(!user){
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


