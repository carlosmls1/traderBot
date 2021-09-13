const crypto = require("crypto-js");
class CryptoAuth {

    signRequest(request){
        request.api_key = this.apiKey;
        const { id, method, params, nonce } = request;

        const paramsString =
            params == null
                ? ""
                : Object.keys(params)
                    .sort()
                    .reduce((a, b) => {
                        return a + b + params[b];
                    }, "");

        const sigPayload = method + id + this.apiKey + paramsString + nonce;

        request.sig = crypto
            .HmacSHA256(sigPayload, this.apiSecret)
            .toString(crypto.enc.Hex);

        return request;
    }

    constructor() {
        this.apiSecret = '';
        this.apiKey = '';
    }
}
module.exports = CryptoAuth
