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

const { MongoConnect } = require('./util/database');
const e = require('express');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); 



 app.use((req, res, next) => {

    const user = new User('Collins', 'munisco12@gmail.com')
    user.save()
        .then(user => {
            req.user = user            
        })
        .catch(err => console.log('user failure from db', err))
        next()
    })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);



MongoConnect(client => {
    console.log('connected to the client')
    app.listen(3030, () => {
        console.log('Listening on 3030')
    })
})
