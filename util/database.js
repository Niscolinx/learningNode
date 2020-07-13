const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const MongoDB = (cb) => {
    MongoClient.connect('mongodb + srv://munisco:munisco6869@cluster0.zhgsa.mongodb.net/learningNode?retryWrites=true&w=majority')
        .then(client => {
            console.log('connected', client)
            cb(client)
        })
        .catch(err => console.log('err connecting', err))
}

module.exports = MongoDB