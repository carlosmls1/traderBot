//https://api.crypto.com/v2/public/get-ticker?instrument_name=SHIB_USDT
const request = require('request');
const requestKey = require('crypto');
const CryptoAuth = require('./../lib/CryptoAuth');

//
const apiOptions = {
    server:
        'https://uat-api.3ona.co/v2/'
        //'https://api.crypto.com/v2/'
};
class API {

    get(method, parameters, requestMethod='GET'){
        let requests = this.auth.signRequest({
            id: Math.floor(Math.random() * 99999999999999),
            method: method,
            params: parameters,
            nonce: Date.now(),
        })

        let requestOptions = {
            url: `https://api.crypto.com/v2/${method}`,
            method: requestMethod,
            body: JSON.stringify(requests),
        };
            request(requestOptions, (err, response, body) => {
                this.response = JSON.parse(body)
            });
         return this.response;
    }
    constructor() {
        this.response = false;
        this.auth = new CryptoAuth();
    }
}
module.exports = API


