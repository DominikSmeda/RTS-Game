class Palisade extends Building {
    constructor() {
        let modelName = "palisade";
        super(modelName)

        this.net.size = 3;
        this.barScale = 0.8;
        this.barHeightOffset = 2.5;
        this.name = "Palisada";

        //seter getter w WorldObject;// wartosc która dostosuje model do wielkosci jaki powinnien miec w naszym swiecie
        this.brushName = "Square";
        this.brushSize = 9;

        this.meshInitScale = 0.5;
        this.assetsManagerInitScale = 0.3;
        this.init()
    }

    init() {

    }
}