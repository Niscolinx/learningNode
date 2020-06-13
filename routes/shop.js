const express = require('express')

const shopRoute = express.Router()


shopRoute.use('/', (req, res, next) => {
    console.log('The home page')
    res.send('<h3>This is the home page</h3>')
})

module.exports = shopRoute;
