const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: false}))

app.use('/add-product', (req, res, next) => {
    console.log('Adding products')
   // res.write('<h3>This is the product page, so please add your product below</h3>')
    res.send('<form action="/product" method="POST"><input type="text" placeholder="fill in your book title" name="bookTitle"></input><button>Add Product</button></form>')
})

app.post('/product', (req, res, next) => {
    const {bookTitle} = req.body
    console.log('This is the book title', bookTitle)
    res.send('Book title added')
})

app.use('/', (req, res, next) => {
    console.log('The home page')
    res.send('<h3>This is the home page</h3>')
})

app.listen(3030, () => {
    console.log('listening to port', 3030)
})