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

    this.client.on("action", (data) => {
        console.log(data);
        try {
            //if (!(data.id instanceof Array)) data.id = [data.id];
            var c = this.game.map.characters;
            for (let i = 0; i < data.move.length; i++) {
                for (let j = 0; j < c.length; j++) {
                    if (c[j].id == data.move[i].id) {
                        c[j].destination = data.move[i].destination;
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