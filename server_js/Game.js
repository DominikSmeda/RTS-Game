class Game {
    constructor() {
        this.map = {
            gold: {},
            characters: [],//[{ id: 0, type:'characters', position: [0, 0], destination: [0, 0], speed: 10 }],
        };
        this.players = [];
        this.length = 0;
        this.totalGold = 0;
    }

    gameTick() {
        //NIE DZIAŁA
        var game = this;
        if (!this.inter) this.inter = setInterval(() => {
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

                var r = Math.sqrt(Math.pow(el.destination[0] - el.position[0], 2) + Math.pow(el.destination[1] - el.position[1], 2)) * 1000 / (el.speed * Sett.unitSpeed * Sett.gameTickLength); //od teraz px na sekundę
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
}
module.exports = Game;