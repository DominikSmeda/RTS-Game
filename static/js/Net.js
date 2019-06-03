class Net {
    constructor(parent) {
        this.parent = parent;
        this.toSend = false;
        this._move = [];
        this._spawn = [];
        this._remove = [];

        this.client = io();
        this.client.on("onconnect", function (data) {
            console.log("Connected to socket, id: " + data.clientName)
        });

        // co 100ms serwer będzie wysyłał info ze zmianami
        this.client.on("gameTick", (data) => {
            // tu są odbierane dane mapy
            //console.log(JSON.stringify(data));
            /*
            dane obierasz w takiej strukturze
            data = {
                spawned: [], - nowo dodane obiekty
                map: {
                    characters: [{ id: 0, position: [0, 0], destination: [0, 0], speed: 10 }], // okrojone, konieczne informacje
                    typ_dodany_przez_ciebie:[{obiekt_1},{obiekt_2}],
                }
            }
            */
            this.parent.recalculateMap(data);

            this.send();
        });
    }

    // zmiana częstotliwości odpowiedzi serwera: patrz ./server_js/Settings.js
    send() {
        if (!this.toSend) return;
        /*
        this.client.emit('action', {
            move: [{  // tablica z identyfikatorami obiektów, które mają się zmienić
                id: 'ajdi',
                destination: ['coordX', 'coordZ'],
            }],
            spawn: [{ type: 'characters (lub inny)',/* to samo co w całym obiekcie, musi być zainicjowane * / }],
            // budowanie jest obsłużone przez spawn:[{type:'obsticles (lub inne)', ...}]
            // spawn po prostu dodaje do mapy tabelę o nowej nazwie (jeśli nie istnieje) i dodaje do niej obiekty
            remove: [{ type: 'characters (lub inny)', id: 'ajdi' }],
            // po usunięciu obiekt dostaje właściwość deleted: true, a nie znika od razu z serwera (przez to klient ma szansę go usunąć)
            // etc.
        })*/
        //console.log(this._spawn)
        this.client.emit('action', {
            move: this._move,
            spawn: this._spawn,
            remove: this._remove
        });
        this._move = [];
        this._spawn = [];
        this._remove = [];
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
}