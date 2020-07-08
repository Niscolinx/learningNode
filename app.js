const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const db = require('./util/database')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

db.execute('SELECT * FROM products').then(res => {
    console.log('the result from the database', res[0])
    for(let items of res[0]){
        console.log('the inner items', items)
        console.log('the object items', items.id)
    }
})

// CREATE TABLE`learning-node`.`products`(
//     `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
//     `title` VARCHAR(255) NOT NULL,
//     `price` DOUBLE NOT NULL,
//     `description` LONGTEXT NOT NULL,
//     `imgUrl` VARCHAR(255) NOT NULL,
//     PRIMARY KEY(`id`),
//     UNIQUE INDEX`id_UNIQUE`(`id` ASC) VISIBLE);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3030, ()=> {
    console.log('listening on port 3030')
});
