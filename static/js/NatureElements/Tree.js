
class Tree extends NatureElement {
    constructor() {
        let modelName = "tree1";
        super(modelName)

        //seter getter w WorldObject;// wartosc która dostosuje model do wielkosci jaki powinnien miec w naszym swiecie
        this.brushName = "Rectangle";
        this.brushSize = 3;

        this.meshInitScale = 1;
        this.assetsManagerInitScale = 1;
        this.init()
    }

    init() {

    }
}