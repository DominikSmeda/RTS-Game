class Game {
    constructor(socketio, Sett) {
        this.socketio = socketio;
        this.Sett = Sett;
        this.map = {
            gold: {},
            characters: [],//[{ id: 0, type:'characters', position: [0, 0], destination: [0, 0], speed: 10 }],
            buildings: [],
        };
        this.players = [];
        this.length = 0;
        this.totalGold = 0;
        this.finished = false;
        this.bases = 0;
    }
    init() {
        if (!this.initInter) this.initInter = setInterval(() => {
            this.socketio.sockets.emit("gameTick", this.map);
            //console.log(this.bases, this.players.length)
            if (this.bases > 1 && this.bases == this.players.length) {
                this.socketio.sockets.emit("start", {});
                this.startGame();
                clearInterval(this.initInter);
            }
        }, this.Sett.gameTickLength);
    }

    startGame() {
        var game = this;
        var Sett = this.Sett;
        var socketio = this.socketio;
        if (!this.inter) this.inter = setInterval(() => {
            if (game.finished == true) { clearInterval(this.inter); return; }
            game.length += Sett.gameTickLength / 1000;
            //złoto
            game.totalGold += Sett.gameTickLength / 1000;
            for (let i = 0; i < Object.keys(game.map.gold).length; i++) {
                game.map.gold[Object.keys(game.map.gold)[i]] += Sett.gameTickLength / 1000;
            }
            //pozycje postaci
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
                    if (el.destinationID) {
                        stop = el.range;
                        var dest = el.position;
                        var f = true;
                        if (el.destinationType == 'buildings') {
                            for (let i = 0; i < game.map.buildings.length; i++) {
                                const el2 = game.map.buildings[i];
                                //console.log(el2.id, el.destination)
                                if (el2.id == el.destinationID) {
                                    dest = el2.position;
                                    f = false;
                                    break;
                                }
                            }
                        }
                        else {
                            for (let i = 0; i < game.map.characters.length; i++) {
                                const el2 = game.map.characters[i];
                                //console.log(el2.id, el.destination)
                                if (el2.id == el.destinationID) {
                                    dest = el2.position;
                                    f = false;
                                    break;
                                }
                            }
                        }
                        if (f) {
                            el.destinationID = null;
                            el.destinationType = null;
                        }
                    } else
                        var dest = el.destination;
                    //ruch
                    var r = (Math.sqrt(Math.pow(dest[0] - el.position[0], 2) + Math.pow(dest[1] - el.position[1], 2))); //od teraz px na sekundę
                    if (r - stop > 0 && !el.obstacle /* && !el.closeEnough */) {
                        el.action = 'walk';
                        r *= 1000 / (el.speed * Sett.unitSpeed * Sett.gameTickLength);
                        el.position[0] += r > 1 ? (dest[0] - el.position[0]) / r : (dest[0] - el.position[0]);
                        el.position[1] += r > 1 ? (dest[1] - el.position[1]) / r : (dest[1] - el.position[1]);
                    }
                    else {
                        el.action = 'idle';
                    }
                }
            }
            for (let x = 0; x < game.map.characters.length; x++) {
                //atak
                const el = game.map.characters[x];
                if (el.attackDest && !el.deleted) {
                    if (el.attackAnimTime <= 0) {
                        if (el.destinationType == 'buildings') {
                            for (let j = 0; j < game.map.buildings.length; j++) {
                                const el2 = game.map.buildings[j];
                                //console.log(el2.id, el.destination)
                                if (!el2.deleted && el2.id == el.attackDest) {
                                    if (el.attackCooldownCounter < 0 &&
                                        el.closeEnough) {
                                        console.log(el)
                                        el2.hp -= el.damage;
                                        //console.log('hp: ' + el2.hp);
                                        el.attackCooldownCounter = el.attackCooldown;
                                        el.attackAnimTime = el.attackAnimLength;
                                        el.action = 'attack';
                                        // jednostka nie żyje
                                        if (el2.hp <= 0) {
                                            // KONIEC GRY
                                            if (el2.base) {
                                                var pl = el2.owner;
                                                for (let c = 0; c < game.players.length; c++) {
                                                    const el5 = game.players[c];
                                                    if (el5.playerID == pl) {
                                                        el5.lost();
                                                        console.log(el5.playerID + ': lost the game')
                                                    } else {
                                                        el5.won();
                                                        console.log(el5.playerID + ': won the game')
                                                    }
                                                }
                                                game.finished = true;
                                                return;
                                            }
                                            for (let k = 0; k < game.players.length; k++) {
                                                let p = game.players[k];
                                                if (p.playerID == el.owner) {
                                                    p.stats.unitsKilled._total++;
                                                    if (!p.stats.unitsKilled[el2.className]) p.stats.unitsKilled[el2.className] = 1;
                                                    else p.stats.unitsKilled[el2.className]++;
                                                    break;
                                                }
                                            }
                                            el2.deleted = true;
                                            el2.ttl = 10;
                                            el2.action = 'die';
                                            for (let k = 0; k < game.map.characters.length; k++) {
                                                if (el2.id == game.map.characters[k].attackDest) {
                                                    let el3 = game.map.characters[k];
                                                    el3.attackDest = null;
                                                    el3.destination = el3.position;
                                                    el3.destinationID = null;
                                                    el3.destinationType = null;
                                                }
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        } else {
                            for (let j = 0; j < game.map.characters.length; j++) {
                                const el2 = game.map.characters[j];
                                //console.log(el2.id, el.destination)
                                if (!el2.deleted && el2.id == el.attackDest) {
                                    //console.log(Math.sqrt(Math.pow(el2.position[0] - el.position[0], 2) + Math.pow(el2.position[1] - el.position[1], 2)))
                                    if (el.attackCooldownCounter < 0 &&
                                        el.range > Math.sqrt(Math.pow(el2.position[0] - el.position[0], 2) + Math.pow(el2.position[1] - el.position[1], 2))) {
                                        el2.hp -= el.damage;
                                        //console.log('hp: ' + el2.hp);
                                        el.attackCooldownCounter = el.attackCooldown;
                                        el.attackAnimTime = el.attackAnimLength;
                                        el.action = 'attack';
                                        // jednostka nie żyje
                                        if (el2.hp <= 0) {
                                            // dodanie do statystyki
                                            for (let k = 0; k < game.players.length; k++) {
                                                let p = game.players[k];
                                                if (p.playerID == el.owner) {
                                                    p.stats.unitsKilled._total++;
                                                    if (!p.stats.unitsKilled[el2.className]) p.stats.unitsKilled[el2.className] = 1;
                                                    else p.stats.unitsKilled[el2.className]++;
                                                    break;
                                                }
                                            }
                                            el2.deleted = true;
                                            el2.ttl = 10;
                                            el2.action = 'die';
                                            for (let k = 0; k < game.map.characters.length; k++) {
                                                if (el2.id == game.map.characters[k].attackDest) {
                                                    let el3 = game.map.characters[k];
                                                    el3.attackDest = null;
                                                    el3.destination = el3.position;
                                                    el3.destinationID = null;
                                                    el3.destinationType = null;
                                                }
                                            }
                                        }
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            // Wyślij dane
            socketio.sockets.emit("gameTick", game.map);
        }, Sett.gameTickLength);
    }
}
module.exports = Game;