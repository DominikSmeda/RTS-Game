
//KLASA z której dziedziczą wszystkie budynki
class Building extends GameObject {
    constructor(className) {
        super(className)
        this.net.type = "buildings";
        this.net.size = 2;
    }
}