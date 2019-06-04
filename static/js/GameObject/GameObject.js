class GameObject extends WorldObject {
    // Ta klasa zbiera wszystkie klasy będące bezpośrednio 
    // elementami rozgrywki (budynki, jednostki)
    constructor(modelName = null) {
        super(modelName);

        this.net.owner = game.playerID;
        this.net.color = game.playerColor;

        //walka
        //wszelkie czasy podano w sekundach
        this.net.attackDest = null; //cel ataku (net.id)
        this.net.canBeDamaged = true; //czy może być zaatakowany (nie zaimplementowano)
        this.net.range = 10; // zasięg ataku
        this.net.damage = 1; // obrażenia
        this.net.attackCooldown = 1;//czas przygotowania przed następnym atakiem
        this.net.attackCooldownCounter = 1;//aktualny pozostały czas przygotowania przeliczany przez serwer
        this.net.attackAnimLength = 0.7;//długość stania w miejscu w czasie wykonywania ataku (by skończyć animację)
        this.net.attackAnimTime = 0;//aktualny pozostały czas stania w miejscu przeliczany przez serwer
        //hp jest w klasie wyżej
    }
}