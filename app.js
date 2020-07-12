const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItems = require('./models/cartItems')
const Order = require('./models/order')
const OrderItems = require('./models/orderItems')

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const sequelize = require('./util/database')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user
            next()
        })
        .catch(err => console.log('user failure from db', err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
User.hasMany(Product)

Cart.belongsTo(User)
User.hasOne(Cart)

Product.belongsToMany(Cart, {through: CartItems})
Cart.belongsToMany(Product, {through: CartItems})

Order.belongsTo(User)
User.hasMany(Order)
Product.belongsToMany(Order, {through: OrderItems})

sequelize
 .sync({force: true})
//.sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if(!user){
           return User.create({name: 'Collins', email: 'collins@gmail.com'})
        }
        return user
    })
    .then(user => {
       user.createCart()
    })
    .then(cart => {
        console.log('connected to the database')
        app.listen(3030, () => {
            console.log('listening on port 3030')
        });
    })
    .catch(err => console.log('error from starting app', err))

