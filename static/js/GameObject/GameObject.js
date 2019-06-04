class GameObject extends WorldObject {
    // Ta klasa zbiera wszystkie klasy będące bezpośrednio 
    // elementami rozgrywki (budynki, jednostki)
    constructor(modelName = null) {
        super(modelName);

        this.net.owner = game.playerID;
        this.net.color = game.playerColor;
    }
}