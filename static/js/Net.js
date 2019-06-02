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
            dane obierasz w takiej samej strukturze, jak są zapisane w GameManager na górze
            {
                characters: [{id:, position:[x, z]}], // okrojone, konieczne informacje
                lights: [],
                obsticles: [],
                terrains: []
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
            build: [],
            // etc.
        })
    }
}