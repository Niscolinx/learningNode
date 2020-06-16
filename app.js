const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const rootDir = require('./path')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))


app.use('/admin',adminRoutes)
app.use(shopRoutes)

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404page.html'))
})

app.listen(3030, () => {
    console.log('listening to port', 3030)
})