
//KLASA z której dziedziczą wszystkie postacie
class Character extends GameObject {
    constructor(model) {
        super(model)

        // dane do serwera
        this.net.speed = 10; //piksele na /tick/ -> na sekundę
        this.net.type = 'characters';
        this.net.destination = [0, 0];
        this.net.destinationID = null;
        this.net.destinationType = null;
        this.net.attackMove = false;

        this.barScale = 0.5;
        this.barHeightOffset = 1.3;


    }

    // override - inny sposób wyliczania pozycji mesha!
    calculatePosition(delta = null) {
        //console.log(delta)
        if (!delta) { // kompatybilność z wywołaniem funkcji w onDataUpdate
            if (this.justCreated) {
                super.calculatePosition();
            }
            return;
        }
        //this.position.x += (Math.abs(this.net.position[0] - this.position.x)) > this.net.speed * SETTINGS.unitSpeed * delta * 1000 ? Math.sign(this.net.position[0] - this.position.x) * this.net.speed * SETTINGS.unitSpeed * delta * 1000 : (this.net.position[0] - this.position.x);
        //this.position.z += (Math.abs(this.net.position[1] - this.position.z)) > this.net.speed * SETTINGS.unitSpeed * delta * 1000 ? Math.sign(this.net.position[1] - this.position.z) * this.net.speed * SETTINGS.unitSpeed * delta * 1000 : (this.net.position[1] - this.position.z);
        var r = this.moving = Math.sqrt(Math.pow(this.net.position[0] - this.position.x, 2) + Math.pow(this.net.position[1] - this.position.z, 2)) / (this.net.speed * SETTINGS.unitSpeed * delta);
        this.position.x += r > 1 ? (this.net.position[0] - this.position.x) / r : (this.net.position[0] - this.position.x);
        this.position.z += r > 1 ? (this.net.position[1] - this.position.z) / r : (this.net.position[1] - this.position.z);
    }
    onDataUpdate() {
        super.onDataUpdate();
        if (this.net.action != 'idle' && this.net.action != 'die') {
            var angle = Math.atan2(
                this.net.position[0] - this.net.destination[0],
                this.net.position[1] - this.net.destination[1]
            );
            // console.log(angle, this.net.position, this.net.destination)
            if (this.net.position[0] - this.net.destination[0] != 0 ||
                this.net.position[1] - this.net.destination[1] != 0)
                this.mainModel.rotation.y = angle - Math.PI;
        }
    }
    onGameTick() {
        super.onGameTick();
        if (this.net.attackMove)
            this.findEnemyInRange();
    }

    //wylicz aktualną pozycję mesha
    onRender(delta) {
        super.onRender(delta); // gdyby coś się pojawiło !JHHSDHSDFSDFHSDFHSD nie przekazałes deltyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        this.calculatePosition(delta);
    }

    // prostsza funkcja do poruszania
    move(x, z) {
        this.edited = true;
        this.net.destination = [x, z];
        // return this.net;
        console.log('m');

    }


}