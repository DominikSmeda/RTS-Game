
//KLASA z której dziedziczą wszystkie postacie
class Character extends WorldObject {
    constructor(model) {
        super(model)

        // dane do serwera
        this.net.speed = 10; //piksele na tick
        this.net.type = 'characters';
        this.net.destination = [0, 0];
    }

    // override - inny sposób wyliczania pozycji mesha!
    calculatePosition(delta = null) {
        //console.log(delta)
        if (!delta) { // kompatybilność z wywołaniem funkcji w onDataUpdate
            if (this.justCreated) {
                this.netPosition.x = this.net.position[0];
                this.netPosition.z = this.net.position[1];
            }
            return;
        }
        this.position.x += (Math.abs(this.net.position[0] - this.position.x)) > this.net.speed * SETTINGS.unitSpeed * delta * 1000 ? Math.sign(this.net.position[0] - this.position.x) * this.net.speed * SETTINGS.unitSpeed * delta * 1000 : (this.net.position[0] - this.position.x);
        this.position.z += (Math.abs(this.net.position[1] - this.position.z)) > this.net.speed * SETTINGS.unitSpeed * delta * 1000 ? Math.sign(this.net.position[1] - this.position.z) * this.net.speed * SETTINGS.unitSpeed * delta * 1000 : (this.net.position[1] - this.position.z);
    }

    //wylicz aktualną pozycję mesha
    onRender(delta) {
        super.onRender(); // gdyby coś się pojawiło
        this.calculatePosition(delta);
    }

    // prostsza funkcja do poruszania
    move(x, z) {
        this.net.destination[0] = x;
        this.net.destination[1] = z;
        return this.net;
    }
}