
const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json')


const getTotalPrice = () => {
    fs.readFile(p, (err, fileContents) => {
        if (err) {
            return []
        }
        else {
            return JSON.parse(fileContents)
        }
    })
}
// getItemsFromCart(cartItem => {
//     let total = 0
//     for (let item of cartItem) {
//         total += Math.floor(Number(item.price))
//     }
//     cartItem.push({ totalPrice: total })
//     console.log('print total cb', this.title)
//})

module.exports = getTotalPrice