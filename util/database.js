
const MongoClient = require('mongodb').MongoClient;

let _db;

const MongoConnect = cb => {
    const uri = "mongodb://localhost:105.112.182.148/32";
    // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
    // client.connect(err => {
    //     const collection = client.db("test").collection("devices")
    //     _db = client.db()
    //     cb(collection)
    //     // perform actions on the collection object
    //     client.close();
    // });
    MongoClient.connect(uri, (err, client) => {
        if(err) {
            console.log('err connecting', err)
            return
        }

        const db = client.db('test')
        db.collection('products').insertOne({
            name: 'Collins', 
            email: 'munisco12@gmail.com'
        })
        .then(res => {
            console.log('the successful result ', res.ops)
        })
        .catch(err => console.log('err connecting to db', err))
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

