const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItems = require('./models/cart-items')

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

Cart.belongsToMany(Users, {through: CartItems})
User.hasOnlyOne(Cart, {through: CartItems})

sequelize.sync()
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
        console.log('connected to the database', user)
        app.listen(3030, () => {
            console.log('listening on port 3030')
        });
    })
    .catch(err => console.log('error from starting app', err))

