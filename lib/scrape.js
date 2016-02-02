var gplay = require("./google-play-scraper");
var helper = require("./helpers");
var bf  = require("./bloomfilter.js");
var bloomFilter = new bf.BloomFilter(

  8 * 1024 * 1024 * 1024 , // number of bits to allocate.
  16                            // number of hash functions.
);
var constants = require('./constants');
var getApps = function(appId, processApp) {
    return function() {
        thisAppId = appId;
        thisProcess = processApp;
    return new Promise(function(resolve, reject) {
            setTimeout(function(){
                console.log("App Called", appId);
                gplay.app(thisAppId).then(app => thisProcess(app)
                , function(error){
                    console.log("Not able to fetch apps");
                    resolve();
                }).then(function() {
                    resolve();
                });
            }, 11000);
    });

    }
}
module.exports.scrapeByToken = function(db, getToken, processApp) {
    token = getToken();
    console.log("Token ======>", token);
    gplay.search({
        term: token,
        num: 250,
    }).then(function(list) {
        count = 0;
        var request = getApps(list[0]['appId'], processApp)();
        for(var i = 1; i < list.length; i++) request = request.then(getApps(list[i]['appId'], processApp));
        return request;
    }).then(function(){
        setTimeout(function() {
            console.log("called Again");
            var token = helper.generateCasinoNames();
            module.exports.scrapeByToken(db,getToken, processApp);
        }, 11001);
    });
    console.log(bloomFilter.size());
}
//g_apps = []
//var ii = 0;
//var i = 0;
//for(ii = 0; ii <=500; ii+=120 ){
    //setTimeout(function() {
        //gplay.list({
                 //category: gplay.category.GAME_ACTION,
                     //collection: gplay.collection.TOP_FREE,
                         //num: 120,
                         //country:'US',
                         //start:ii


        //})
        //.then(function(apps){
            //g_apps=g_apps.concat(apps);
        //})
        //.catch(function(e){
                 //console.log('There was an error fetching the list!');

        //});
    //}, 10000*i);
//i+=1;
//}


//setTimeout(function(){
//console.log(g_apps);
//}, 50000);
