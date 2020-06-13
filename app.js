const express = require('express')
const bodyParser = require('body-parser')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()
app.use(bodyParser.urlencoded({extended: false}))

app.use(adminRoutes)
app.use(shopRoutes)

app.listen(3030, () => {
    console.log('listening to port', 3030)
})