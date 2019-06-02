module.exports = function (game, client) {
    this.connected = true;
    this.game = game;
    console.log(client.id + ": connected");
    this.client = client;

    this.client.emit("onconnect", {
        clientName: client.id
    });

    this.client.on("disconnect", () => {
        this.connected = false;
        console.log(client.id + ": disconnected");
        delete this;
    });

    this.c = this.game.map.characters;
    this.map = this.game.map;
    this.client.on("action", (data) => {
        console.log(data);
        try {
            //if (!(data.id instanceof Array)) data.id = [data.id];
            for (let i = 0; i < data.move.length; i++) {
                for (let j = 0; j < this.c.length; j++) {
                    if (this.c[j].id == data.move[i].id) {
                        this.c[j].destination = data.move[i].destination;
                        break;
                    }
                }
            }
            for (let i = 0; i < data.spawn.length; i++) {
                var el = data.spawn[i];
                if (!this.map[el.type]) this.map[el.type] = [];
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
                this.map[el.type].push(data.spawn[i]);
            }
            for (let i = 0; i < data.remove.length; i++) {
                var el = data.remove[i];
                if (!this.map[el.type]) continue;
                for (let j = 0; j < this.map[el.type].length; j++) {
                    if (this.map[el.type][j].id == el.id) {
                        this.map[el.type][j].deleted = true;
                        this.map[el.type][j].ttl = 5;
                        break;
                    }
                }
            }
        }
        catch (e) { console.log('Internal error: ' + e) }
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