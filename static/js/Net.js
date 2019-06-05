class Net {
    constructor(parent) {
        this.parent = parent;
        this.playerID = parent.playerID ? parent.playerID : (Cookies.get('playerID') ? Cookies.get('playerID') : null);

        this.toSend = false;
        this._move = [];
        this._spawn = [];
        this._remove = [];
        this._update = [];

        this.client = io();
        this.client.on("onconnect", (data) => {
            console.log(data, this.playerID);
            console.log("Connected to socket, id: " + data.clientName);
            this.client.emit('con', {
                playerID: this.playerID
            });
        });
        this.client.on("con", (data, err) => {
            console.log(data, err)
            this.playerID = this.parent.playerID = data.playerID;
            Cookies.set('playerID', data.playerID, { path: '/' });
            this.parent.playerColor = data.playerColor;
        });

        // co 100ms serwer będzie wysyłał info ze zmianami
        this.client.on("gameTick", (data) => {
            this.parent.recalculateMap(data);
            this.send();
        });
    }

    getStats(callback) {
        this.client.on('myStats', callback)
        this.client.emit('myStats', {});
    }

    saveStats(nick) {
        this.client.emit('saveStats', { name: nick });
    }

    getAllStats(callback) {
        this.client.on('getStats', callback);
        this.client.emit('getStats', {});
    }

    // zmiana częstotliwości odpowiedzi serwera: patrz ./server_js/Settings.js
    send() {
        if (!this.toSend) return;
        this.client.emit('action', {
            move: this._move,
            spawn: this._spawn,
            remove: this._remove,
            update: this._update,
        });
        this._move = [];
        this._spawn = [];
        this._remove = [];
        this._update = [];
        this.toSend = false;
    }

    /* Użycie:
    spawn({dane obiektu, np. id, type})
    */
    spawn(data) {
        for (let i = 0; i < this._spawn.length; i++) {
            if (this._spawn[i].id == data.id) {
                this._spawn[i] = data;
                return;
            }
        }
        this.toSend = true;
        this._spawn.push(data);
    }
    // remove({id:'',type:''}) - tyle wystarczy
    remove(data) {
        for (let i = 0; i < this._remove.length; i++) {
            if (this._remove[i].id == data.id) {
                this._remove[i] = data;
                return;
            }
        }
        this.toSend = true;
        this._remove.push(data);
    }
    // move({id:'', destination:[x,z]}) - tyle wystarczy (na razie)
    move(data) {
        for (let i = 0; i < this._move.length; i++) {
            if (this._move[i].id == data.id) {
                this._move[i] = data;
                return;
            }
        }
        this.toSend = true;
        this._move.push(data);
    }
    update(data) {
        for (let i = 0; i < this._update.length; i++) {
            if (this._update[i].id == data.id) {
                this._update[i] = data;
                return;
            }
        }
        this.toSend = true;
        this._update.push(data);
    }
}