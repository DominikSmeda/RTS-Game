class Tower extends Building {
    constructor() {
        let modelName = "tower";
        super(modelName)

        this.name = "Wierza";
        this.net.size = 1.2;
        this.barScale = 1.5;
        this.barHeightOffset = 6;
        this.assetsManagerData = {//inne dane w assets Managerze
            drewno: 10,
            kamien: 30
        }
        //seter getter w WorldObject;// wartosc która dostosuje model do wielkosci jaki powinnien miec w naszym swiecie
        this.brushName = "Square";
        this.brushSize = 5;

        this.meshInitScale = 0.5;
        this.assetsManagerInitScale = 0.09;
        this.init()
    }

    init() {

    }
}