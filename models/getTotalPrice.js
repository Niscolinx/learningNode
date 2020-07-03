
const fs = require('fs')
const path = require('path')

const tp = path.join(path.dirname(process.mainModule.filename), 'data', 'totalprice.json')
const cp = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json')



const getTotalPrice = fs.readFile(cp, (err, fileContents) => {
        if (err) {
           // res.send('Hello world')
           console.log('the error', err)
        }
        else {
            return JSON.parse(fileContents)
        }
    })

// getItemsFromCart(cartItem => {
//     let total = 0
//     for (let item of cartItem) {
//         total += Math.floor(Number(item.price))
//     }
//     cartItem.push({ totalPrice: total })
//     console.log('print total cb', this.title)
//})

module.exports = getTotalPrice