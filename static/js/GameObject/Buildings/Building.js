
//KLASA z której dziedziczą wszystkie budynki
class Building extends GameObject {
    constructor(modelName) {
        super(modelName)//Poprawione
        this.net.type = "buildings";
        this.net.size = 1.2;
        this.barScale = 4;
        this.barHeightOffset = 5;
    }
}