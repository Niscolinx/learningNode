
const MongoClient = require('mongodb').MongoClient;


let _db;

const MongoConnect = cb => {
    
    const uri = 'mongodb+srv://munisco:fkNZcq4s9ZmcXho5@cluster0.zhgsa.mongodb.net/learningNode'
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    client.connect((err, db) => {
        console.log('arguments from connect', err, db)
      
        cb(client)
        _db = client.db('learningNode')
    })


}

const getDB = () => {
    if (_db) {
        return _db
    }
    throw 'No database found!'
}

module.exports = {
    MongoConnect,
    getDB
}

