const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const rootDir = require('./path')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')
app.set('views', 'views')
app.use('/admin',adminRoutes.router)
app.use(shopRoutes)

app.use((req, res) => {
    res.status(404).render('404page', {pageTitle: 'Page not found'})
})

app.listen(3030, () => {
    console.log('listening to port', 3030)
})