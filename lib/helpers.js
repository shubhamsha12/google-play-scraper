var Promise = require('bluebird');
var play = require('./google-play-scraper');

module.exports.requestError = function () {
    //TODO improve details
    throw Error('Error requesting Google Play');
};

/*
 * Return the proper parseList function according to the options.
 */
module.exports.getParseList = function (opts) {

    if (opts.fullDetail) {
        return getParseDetailList(opts.lang);
    }

    return parseList;
};
module.exports.generateCasinoNames = function() {
    words = ["slot","chips","Baccarat","Blackjack","Craps","Roulette","Sic bo","Slot machines","Poker","Keno","Bingo","Asian stud","Asia Poker","farkle","boule", "pachinko","tequila poker", "rummy", "Pontoon","Baccarat","Blackjack","Blackjack switch","Caribbean Stud Poker","Casino Hold'em","Casino war","Chinese poker","Fan-Tan","Faro","Four card poker","Let It Ride","Mambo stud","Pai gow poker","Poker","Pyramid Poker","Red Dog","Spanish 21","Super Fun 21","Teen Patti","Texas Hold'em","Texas Hold'em Bonus Poker","Three card poker","Two-up","Penny-up","Ultimate Texas Hold'em","Rung", "Wheel of Fortune" ];
    word1 = "casino";
    word2 = words[Math.floor(Math.random()*1000)%words.length];

    if(Math.floor(Math.random()*100)%2 == 0) word1="";
    return word1+ " " +word2;

}

module.exports.generateNames = function() {
        var adjs = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry",
            "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring",
            "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered",
            "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green",
            "long", "late", "lingering", "bold", "little", "morning", "muddy", "old",
            "red", "rough", "still", "small", "sparkling", "throbbing", "shy",
            "wandering", "withered", "wild", "black", "young", "holy", "solitary",
            "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine",
            "polished", "ancient", "purple", "lively", "nameless"]

             , nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea",
             "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn",
             "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird",
             "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower",
             "firefly", "feather", "grass", "haze", "mountain", "night", "pond",
             "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf",
             "thunder", "violet", "water", "wildflower", "wave", "water", "resonance",
             "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper",
             "frog", "smoke", "star"];

             return adjs[Math.floor(Math.random()*(adjs.length-1))]+" "+nouns[Math.floor(Math.random()*(nouns.length-1))];

}

/*
 * Returns a parseList function that just grabs the appIds,
 * fetches every app detail with the app() function and returns
 * a Promise.all().
 */
function getParseDetailList(lang) {

    return function ($) {
        var promises = $('.card').get().map(function (app) {
            var appId = $(app).attr('data-docid');
            return play.app(appId, lang);
        });

        return Promise.all(promises);
    };

}

function parseList($) {
    return $('.card').get().map(function (app) {
        return parseApp($(app));
    });
};

function parseApp(app) {
    var price = app.find('span.display-price').first().text();

    //if price string contains numbers, it's not free
    var free = !/\d/.test(price);
    if (free) {
        price = '0';
    }

    var scoreText = app.find('div.tiny-star').attr('aria-label');
    var score;
    if (scoreText) {
        score = parseFloat(scoreText.match(/[\d.]+/)[0]);
    }

    return {
        url: 'https://play.google.com' + app.find('a').attr('href'),
        appId: app.attr('data-docid'),
        title: app.find('a.title').attr('title'),
        developer: app.find('a.subtitle').text(),
        icon: app.find('img.cover-image').attr('data-cover-large'),
        score: score,
        price: price,
        free: free
    };
}



