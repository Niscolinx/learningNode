
const MongoClient = require('mongodb').MongoClient;

let _db;

const MongoConnect = cb => {
    const uri = "mongodb+srv://munisco:munisco6869@cluster0.zhgsa.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("test").collection("devices");
        _db = client
        // perform actions on the collection object
        client.close();
    });
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

