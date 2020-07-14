
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://munisco:munisco6869@cluster0.zhgsa.mongodb.net/learningNode?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true });
let _db;

const MongoConnect = (cb) => {
    client.connect((err, db) => {
        const collection = client.db("test").collection("devices");
        console.log('the err', err)
        _db = db
        cb(collection)
        client.close();
    });
}


const getDB = () => {
    console.log('the db', db)
        if (_db) {
        return _db
    }
    throw 'No database found!'
}

module.exports = {
    MongoConnect,
    getDB
}

