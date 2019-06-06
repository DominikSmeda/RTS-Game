
class Base extends Building {
    constructor() {
        let modelName = "castle";
        super(modelName)

        this.net.size = 10;
        this.net.base = true;
        this.name = "Baza";

        //seter getter w WorldObject;// wartosc która dostosuje model do wielkosci jaki powinnien miec w naszym swiecie
        this.brushName = "Square";
        this.brushSize = 3;

        this.meshInitScale = 0.5;
        this.assetsManagerInitScale = 0.09;
        this.init()
    }

    init() {

    }
}