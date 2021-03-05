
class Rock extends NatureElement {
    constructor() {
        let modelName = "rock1";
        super(modelName)

        this.name = "Skała";
        this.meshInitScale = 1; //seter getter w WorldObject;// wartosc która dostosuje model do wielkosci jaki powinnien miec w naszym swiecie
        this.brushName = "Circle";
        this.brushSize = 2;
        this.meshInitScale = 0.05;
        this.assetsManagerInitScale = 0.08;

        this.assetsManagerData = {//inne dane w assets Managerze
            kamien: 10
        }

        this.init()
    }

    init() {

    }
}