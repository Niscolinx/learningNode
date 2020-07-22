const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

// const Product = require('./models/product')
const User = require('./models/user')
// const Cart = require('./models/cart')
// const CartItems = require('./models/cartItems')
// const Order = require('./models/order')
// const OrderItems = require('./models/orderItems')

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//const { MongoConnect } = require('./util/database');
const mongoose = require('mongoose')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//5f14a399fe813c1948012cdf  the user id from the db
// app.use((req, res, next) => {
//     const newUser = new User('Collins', 'munisco12@gmail.com')
//     newUser.save()
//         .then(user => {
//             req.user = user
//             next()
//         })
//         .catch(err => console.log('user failure from db', err))
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


mongoose.connect('mongodb+srv://munisco:fkNZcq4s9ZmcXho5@cluster0.zhgsa.mongodb.net/shop', { useNewUrlParser: true, useUnifiedTopology: true })
.then(result => {
    console.log('connected to the client')
    app.listen(3030, () => {
        console.log('Listening on 3030')
    })
}).catch(err => console.log(err))

