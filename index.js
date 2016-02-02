var gplay = require("./lib/google-play-scraper");
var scrape = require("./lib/scrape");

var helper = require("./lib/helpers");
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    var processApp = function(app) {
        return new Promise(function(resolve, reject){
            if(app["genre"].indexOf('Casino') != -1|| app["genre"].indexOf('Card') != -1){
                console.log(token, " " ,app.genre, app.title);
                db.collection('casino_apps').insertOne(app, function(error){
                    if(error) console.log(error)
                });
                resolve();
            }
        });
    }
    scrape.scrapeByToken(db, helper.generateCasinoNames, processApp);

});
