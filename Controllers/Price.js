const API = require('../lib/cryptoApi');
const db = require('./Database');
const WebSocket = require('ws');
const ws = new WebSocket('wss://stream.crypto.com/v2/market');
//const ws = new WebSocket('wss://uat-stream.3ona.co/v2/market');

class Price {
    constructor() {
        this.id = Math.floor(Math.random() * 99999999999999);
        this.db = new db();
        this.code = 'BTC_USDT';
        ///
        ws.onopen = function(){
            console.log('Empieza el socket pls')
            ws.send(JSON.stringify({
                "id": this.id,
                "method": "subscribe",
                "params": {
                    "channels": [`ticker.BTC_USDT`]
                },
                "nonce": Date.now()
            }))
        }
    }

    startWs(){

    }

    async getTrade(coin) {
        console.log("Starting...");
        try {
            const res = await this.db.getTrade(coin);
            this.item = res;
        } catch (error) {
            console.log(error);
        }
        console.log("Done!");
    }

    async saveEntry(coin, price) {
        this.db.add(coin, price);
    }


    run() {
        this.getTrade('BTC_USDT').then((r)=>{
            let item_local = this.item[0]
            this.startWs();
            ws.onmessage = function(msg) {
                let response =  JSON.parse(msg.data);
                if(response.method==='public/heartbeat'){
                    console.log('Yes! WE LIVE')
                    ws.send(JSON.stringify({ id: response.id, method: 'public/respond-heartbeat' }))
                }
                if(response.method==='subscribe'){
                    if(response.result){
                        this.data = (response.result.data[0]);
                        let item_server ={
                            'entry_price': this.data.a,
                            'coin': 'BTC_USDT',
                            'next_step': ''
                        }
                        if(item_local){
                            let dif = item_server.entry_price-item_local.entry_price;
                            dif =  dif/item_server.entry_price;
                            dif = (dif)*100;
                            if(item_local.entry_price > item_server.entry_price){
                                console.log('Price down', (dif).toFixed(2),'%')
                            }else{
                                console.log('Price Up')
                            }
                            console.warn('Realtime price:', item_server.entry_price)
                            console.warn('Entry price:', item_local.entry_price)
                        }
                    }
                }
            }
        });
    }
}

module.exports = Price
