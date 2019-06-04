var Player = require("./server_js/Player.js");
var Sett = require("./server_js/Settings.js");
var Game = require("./server_js/Game.js");
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

// !!! USUWA LOGOWANIE W KONSOLI !!!
if (Sett.suppressConsoleLog) console.log = function () { }

// załatwia wszystkie sprawy dostępu do plików
app.use(express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'))
});
var rooms = [];
/* var game = {
    map: {
        //_: ['characters'],
        characters: [],//[{ id: 0, type:'characters', position: [0, 0], destination: [0, 0], speed: 10 }],
    },
}; */
var game = new Game();
// Sokety
socketio.on('connection', function (client) {
    client.emit("onconnect", {
        clientName: client.id
    });
    client.on("con", (data) => {
        if (data.playerID) {
            for (let i = 0; i < game.players.length; i++) {
                const el = game.players[i];
                if (el.playerID == data.playerID) {
                    el.reconnect(client);
                    return;
                }
            }
        }
        game.players.push(new Player(game, client));

    });
    //game.players.push(new Player(game, client));
    //new Player(game, client);
    //console.log(game);
    gameTick();
});

var inter = null;
async function gameTick() {
    if (!inter) inter = setInterval(function () {
        for (let x = 0; x < game.map.characters.length; x++) {
            const el = game.map.characters[x];
            el.attackCooldownCounter -= Sett.gameTickLength / 1000;
            el.attackAnimTime -= Sett.gameTickLength / 1000;

            //usuwanie
            if (el.deleted && (el.ttl--) < 1) {
                delete game.map.characters.splice(x--, 1);
                continue;
            }
            var stop = 0;

            //ruch do celu
            if (el.attackAnimTime <= 0) { //gdy nie wykonuje ataku
                if (typeof el.destination == 'string') {
                    stop = el.range;
                    var dest = el.position;
                    for (let i = 0; i < game.map.characters.length; i++) {
                        const el2 = game.map.characters[i];
                        //console.log(el2.id, el.destination)
                        if (el2.id == el.destination) {
                            dest = el2.position;
                            break;
                        }
                    }
                } else
                    var dest = el.destination;
                //ruch
                var r = (Math.sqrt(Math.pow(dest[0] - el.position[0], 2) + Math.pow(dest[1] - el.position[1], 2))); //od teraz px na sekundę
                if (r - stop > 0) {
                    r *= 1000 / (el.speed * Sett.unitSpeed * Sett.gameTickLength);
                    el.position[0] += r > 1 ? (dest[0] - el.position[0]) / r : (dest[0] - el.position[0]);
                    el.position[1] += r > 1 ? (dest[1] - el.position[1]) / r : (dest[1] - el.position[1]);
                }
            }
        }
        for (let x = 0; x < game.map.characters.length; x++) {
            //atak
            const el = game.map.characters[x];
            if (el.attackDest && !el.deleted) {
                if (el.attackAnimTime <= 0)
                    for (let j = 0; j < game.map.characters.length; j++) {
                        const el2 = game.map.characters[j];
                        //console.log(el2.id, el.destination)
                        if (!el2.deleted && el2.id == el.attackDest) {
                            //console.log(Math.sqrt(Math.pow(el2.position[0] - el.position[0], 2) + Math.pow(el2.position[1] - el.position[1], 2)))
                            if (el.attackCooldownCounter < 0 &&
                                el.range > Math.sqrt(Math.pow(el2.position[0] - el.position[0], 2) + Math.pow(el2.position[1] - el.position[1], 2))) {
                                el2.hp -= el.damage;
                                console.log('hp: ' + el2.hp);
                                el.attackCooldownCounter = el.attackCooldown;
                                el.attackAnimTime = el.attackAnimLength;
                                if (el2.hp <= 0) {
                                    el2.deleted = true;
                                    el2.ttl = 10;
                                }
                            }
                            break;
                        }
                    }
            }
        }
        // Wyślij dane
        socketio.sockets.emit("gameTick", game.map);
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


