
class Base extends Building {
    constructor() {
        let modelName = "castle";
        super(modelName)

        this.barScale = 3;
        this.barHeightOffset = 4.8;
        this.net.size = 10;
        this.net.base = true;
        this.HP = 300;
        this.name = "Baza";
        this.assetsManagerData = {//inne dane w assets Managerze
            typ: 'unikalna'
        }
        //seter getter w WorldObject;// wartosc która dostosuje model do wielkosci jaki powinnien miec w naszym swiecie
        this.brushName = "Square";
        this.brushSize = 9;

        this.meshInitScale = 0.5;
        this.assetsManagerInitScale = 0.09;
        this.init()
    }

    init() {

    }
}