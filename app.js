const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded())

app.use('/add-product', (req, res, next) => {
    console.log('Adding products')
    res.send('<h3>This is the product page, so please add your product below</h3>')
    res.send('<form action="/product" method="POST"><input type="text" placeholder="fill in your book title" name="book-title"></input><button>Add Product</button></form>')
})

app.post('/product', (req, res, next) => {
    const {name} = req.body
    console.log('This is the book title', name)
})

app.use('/', (req, res, next) => {
    console.log('The home page')
    res.send('<h3>This is the home page</h3>')
})

app.listen(3030, () => {
    console.log('listening to port', port)
})