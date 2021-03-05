
class Tree extends NatureElement {
    constructor() {
        let modelName = "tree1";
        super(modelName)

        this.name = "Drzewo";
        //seter getter w WorldObject;// wartosc która dostosuje model do wielkosci jaki powinnien miec w naszym swiecie
        this.brushName = "Square";
        this.brushSize = 3;

        this.meshInitScale = 1;
        this.assetsManagerInitScale = 1;

        this.assetsManagerData = {//inne dane w assets Managerze
            drewno: 20,
        }

        this.init()
    }

    init() {

    }
}