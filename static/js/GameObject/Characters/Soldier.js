
class Soldier extends Character {
    constructor() {
        let modelName = "Soldier1"
        super(modelName);

        this.net.speed = 25;
        this.net.damage = 10;

        this.meshInitScale = 0.005;
        this.assetsManagerInitScale = 0.01;
    }
}