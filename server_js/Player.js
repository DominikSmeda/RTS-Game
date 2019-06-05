class Player {
    constructor(game, client) {
        this.colors = [0x0000ff, 0xff0000, 0xffff00, 0x00ff00];
        this.connected = true;
        //this.playing = true;
        this.game = game;
        console.log(client.id + ": connected");
        this.client = client;
        this.playerID = client.id;
        this.playerColor = this.colors[game.players.length % this.colors.length];

        this.c = this.game.map.characters;
        this.map = this.game.map;
        this.defineSocket();
    }
    reconnect(client) {
        this.client = client;
        this.defineSocket();
        console.log(this.playerID + ': reconnected with connection id ' + client.id)
    }
    defineSocket() {
        this.client.emit("con", {
            playerID: this.playerID,
            playerColor: this.playerColor,
            reconnected: !this.connected
        });
        this.connected = true;

        this.client.on("disconnect", () => {
            this.connected = false;
            console.log(this.client.id + ": disconnected");
            //delete this;
        });

        this.client.on("action", (data) => {
            //console.log(data);
            try {
                //if (!(data.id instanceof Array)) data.id = [data.id];
                for (let i = 0; i < data.move.length; i++) {
                    for (let j = 0; j < this.c.length; j++) {
                        if (this.c[j].id == data.move[i].id) {
                            //if (this.c[j].owner == data.move[i].owner) - zabezpieczenie przedruchem czegoś nie swojego
                            this.c[j].destination = data.move[i].destination;
                            break;
                        }
                    }
                }
                for (let i = 0; i < data.spawn.length; i++) {
                    var el = data.spawn[i];
                    if (!this.map[el.type]) {
                        this.map[el.type] = [];
                    }
                    else {
                        var flag = false;
                        for (let j = 0; j < this.map[el.type].length; j++) {
                            if (this.map[el.type][j].id == el.id) {
                                flag = true;
                                break;
                            }
                        }
                        if (flag) continue;
                    }
                    if (data.spawn[i].owner != 'ambient') data.spawn[i].owner = this.playerID;
                    this.map[el.type].push(data.spawn[i]);
                }
                for (let i = 0; i < data.update.length; i++) {
                    var el = data.update[i];
                    if (!this.map[el.type]) continue;
                    for (let j = 0; j < this.map[el.type].length; j++) {
                        if (this.map[el.type][j].id == el.id) {
                            var mapel = this.map[el.type][j];
                            for (let i = 0; i < Object.keys(el).length; i++) {
                                var k = Object.keys(el)[i];
                                mapel[k] = el[k];
                            }
                            break;
                        }
                    }
                }
                for (let i = 0; i < data.remove.length; i++) {
                    var el = data.remove[i];
                    if (!this.map[el.type]) continue;
                    for (let j = 0; j < this.map[el.type].length; j++) {
                        if (this.map[el.type][j].id == el.id) {
                            this.map[el.type][j].deleted = true;
                            if (!this.map[el.type][j].ttl) this.map[el.type][j].ttl = 5;
                            break;
                        }
                    }
                }
            }
            catch (e) { console.warn('Internal error: ' + e) }
        });

        this.client.on("fullMap", () => {
            this.client.emit("fullMap", game.map);
        });


        this.sendGameTickData = function () {
            this.client.emit("gameTick", {
                t: game.map
            });
        }
    }
}

module.exports = Player;