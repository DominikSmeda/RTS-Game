var Player = require("./server_js/Player.js");
var Sett = require("./server_js/Settings.js");
//var http = require("http")
var express = require("express")
var app = express()
var http = require('http').createServer(app);
const PORT = 3000;
const path = require('path');
//const fs = require('fs');
//const concat = require('concat');
var socketio = require('socket.io')(http);
var mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var _db;

// załatwia wszystkie sprawy dostępu do plików
app.use(express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'))
});

var game = {
    //players: [],
    map: {
        //_: ['characters'],
        characters: [],//[{ id: 0, type:'characters', position: [0, 0], destination: [0, 0], speed: 10 }],
    },
};
// Sokety
socketio.on('connection', function (client) {
    //game.players.push(new Player(game, client));
    new Player(game, client)
    //console.log(game);
    gameTick();
});

var inter = null;
async function gameTick() {
    if (!inter) inter = setInterval(function () {

        for (let i = 0; i < game.map.characters.length; i++) {
            const el = game.map.characters[i];
            if (el.deleted && (el.ttl--) < 1) {
                delete game.map.characters.splice(i--, 1);
                continue;
            }
            //el.position[0] += (Math.abs(el.destination[0] - el.position[0])) > el.speed * Sett.unitSpeed ? Math.sign(el.destination[0] - el.position[0]) * el.speed * Sett.unitSpeed : (el.destination[0] - el.position[0]);
            //el.position[1] += (Math.abs(el.destination[1] - el.position[1])) > el.speed * Sett.unitSpeed ? Math.sign(el.destination[1] - el.position[1]) * el.speed * Sett.unitSpeed : (el.destination[1] - el.position[1]);

            //var r = Math.sqrt(Math.pow(el.destination[0] - el.position[0], 2) + Math.pow(el.destination[1] - el.position[1], 2))
            //el.position[0] += r > el.speed * Sett.unitSpeed ? (el.destination[0] - el.position[0]) * el.speed * Sett.unitSpeed / r : (el.destination[0] - el.position[0]);
            //el.position[1] += r > el.speed * Sett.unitSpeed ? (el.destination[1] - el.position[1]) * el.speed * Sett.unitSpeed / r : (el.destination[1] - el.position[1]);

            var r = Math.sqrt(Math.pow(el.destination[0] - el.position[0], 2) + Math.pow(el.destination[1] - el.position[1], 2)) / (el.speed * Sett.unitSpeed)
            el.position[0] += r > 1 ? (el.destination[0] - el.position[0]) / r : (el.destination[0] - el.position[0]);
            el.position[1] += r > 1 ? (el.destination[1] - el.position[1]) / r : (el.destination[1] - el.position[1]);
        }
        // Wyślij dane
        socketio.sockets.emit("gameTick", game.map);
        /* for (let i = 0; i < game.players.length; i++) {
            //console.log(i, game.players);
            const el = game.players[i];
            if (!el.connected) {
                delete game.players.splice(i--, 1);
                continue;
            }
            el.sendGameTickData();
        } */
    }, Sett.gameTickLength);
}

mongoClient.connect("mongodb://localhost/RTS", function (err, db) {
    if (err) console.log(err)
    else console.log("mongo podłączone!")
    //tu można operować na utworzonej bazie danych db lub podstawić jej obiekt 
    // pod zmienną widoczną na zewnątrz    
    _db = db;
})


http.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})


/*
// Zamiast dodawać wszystkie pliki js-a, złącz je w jeden plik i wyślij!
// Złącza je raz na uruchomienie serwera... musisz go restartować
// W dalszej kolejności można dodać minify itp.
// Kod synchroniczny!
// Ścieżka: ./static/merged/merged.js
// URL: /merged.js
// moduły: fs, concat

// Kolejność inicjalizacji ma teraz duże znaczenie i łączenie w jeden
// plik aktualnie wszystko niszczy - wycofywanie zmian

// https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j
function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}
var paths = [];
//  --- libs/* sprawia problemy - należy wpisywać te skrypty własnoręcznie
// walkSync('./static/libs', function (filePath, stat) {
//     paths.push(filePath);
// });
walkSync('./static/js', function (filePath, stat) {
    paths.push(filePath);
});
console.log(paths)
concat(paths, './static/merged/merged.js');
app.get('/merged.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'merged', 'merged.js'))
});
*/


