var request = require('request');
var Cookie = require('request-cookies').Cookie;

var Requester = function () {

    this.headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0',
    };


    /**
     * Send get request
     * @param url
     * @param callback
     */
    this.doGet = function(url, callback) {
        request({
            method: 'GET',
            uri: url,
            headers: this.headers,
        }, function(err, res, body) {callback(err, res, body)});
    };

    /**
     * Send post request
     * @param url
     * @param formData
     * @param callback
     */
    this.doPost = function (url, formData, callback) {
        request({
            method: 'POST',
            uri: url,
            headers: this.headers,
            body: formData
        }, function(err, res, body) {callback(err, res, body)});
    };

    /**
     * Get cookies by set-cookie response header of given url
     * @param url: string
     * @param callback
     */
    this.getCookies = function(url, callback) {
        request({
            method: 'GET',
            uri: url,
            headers: this.headers,
        }, function(err, res, body) {
            let rawCookies = res.headers['set-cookie'];
            let parsedCookies = {};
            for (let rawCookie in rawCookies) {
                let parsedCookie = new Cookie(rawCookies[rawCookie]);
                parsedCookies[parsedCookie.key] = parsedCookie.value;
            }
            callback(parsedCookies);
        });
    }
};

module.exports = new Requester();