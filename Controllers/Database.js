const MongoClient = require('mongodb').MongoClient
const uri = "";


class Database {
    constructor() {
        this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    }
    list(){
        this.client.connect(err => {
            const collection = this.client.db("traderBot").collection("trade");
            console.log(collection)
        });
    }

    async getTrade(coin){
        const db = await MongoClient.connect(uri);
        const dbo = db.db("traderBot");
        return await dbo.collection("trade").find({coin: {$eq: coin}}).toArray();
    }

    add(coin, price){
        let doc = {
            'entry_price': price,
            'coin': coin,
            'next_step': ''
        }
        this.client.connect((err) => {
            const collection = this.client.db("traderBot").collection("trade");
            collection.insertOne(doc, function(err,docsInserted){
                console.log('New register',docsInserted);
            });
        });
    }
}

module.exports = Database;
