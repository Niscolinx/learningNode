
const MongoClient = require('mongodb').MongoClient;


let _db;
//const uri = "mongodb+srv://cluster0.zhgsa.mongodb.net/learningNode"
//const uri = "mongodb+srv://munisco:munisco6869@cluster0.zhgsa.mongodb.net/products?//retryWrites=true&w=majority";

const MongoConnect = cb => {
    // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
    // client.connect(err => {
        //     const collection = client.db("test").collection("devices")
    //     _db = client.db("learningNode").collection("users")
    //     cb(collection)
    //     // perform actions on the collection object
    //     //client.close();
    // });
    // MongoClient.connect(uri, (err, client) => {
        //     if(err) {
            //         console.log('err connecting', err)
    //         return
    //     }
    
    //     const db = client.db('learningNode')
    //     cb(client)
    //     _db = db
    
    // })
    
    const uri = "mongodb://localhost:105.112.182.148/32";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    client.connect(err => {
       // const collection = client.db("test").collection("devices");
 
        // perform actions on the collection object
        cb(client)
        //client.close();
        _db = client.db('learningNode')
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

