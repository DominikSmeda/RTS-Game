class Net {
    constructor() {
        this.client = io();
        this.client.on("onconnect", function (data) {
            console.log("Connected to socket, id: " + data.clientName)
        });

        // co 100ms serwer będzie wysyłał info ze zmianami
        this.client.on("gameTick", function (data) {
            // tu są odbierane dane mapy
            console.log(data.t);
            /*
            dane obierasz w takiej strukturze
            {
                characters: [{ id: 0, position: [0, 0], destination: [0, 0], speed: 10 }], // okrojone, konieczne informacje
                typ_dodany_przez_ciebie:[{obiekt_1},{obiekt_2}],
            }
            */
        });
    }

    send() {
        this.client.emit('action', {
            move: [{  // tablica z identyfikatorami obiektów, które mają się zmienić
                id: 'ajdi',
                destination: ['coordX', 'coordZ'],
            }],
            spawn: [{ type: 'characters (lub inny)',/* to samo co w całym obiekcie, musi być zainicjowane */ }],
            // budowanie jest obsłużone przez spawn:[{type:'obsticles (lub inne)', ...}]
            // spawn po prostu dodaje do mapy tabelę o nowej nazwie (jeśli nie istnieje) i dodaje do niej obiekty
            remove: [{ type: 'characters (lub inny)', id: 'ajdi' }],
            // po usunięciu obiekt dostaje właściwość deleted: true, a nie znika od razu z serwera (przez to klient ma szansę go usunąć)
            // etc.
        })
    }
}