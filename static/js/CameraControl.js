class CameraControl {

    constructor(parent) {
        this.down = [false, false, false]; //przyciski wciśnięte: lewy, środkowy, prawy myszki
        this.prevPos = null;

        this.pointPos = [0, 0];
        this.R = 400;
        this.initR = 400;
        this.angleV = Math.PI / 4;
        this.angleH = 0;

        this.axesHelper = new THREE.AxesHelper(10);

        // prędkość przesuwania planszy
        this.moveSpeed = 1;

        this.camera = parent.camera;
        this.isPressed = parent.isPressed;
        parent.scene.add(this.axesHelper);
    }
    mousedown(e) {
        if (e.button == 1)
            this.prevPos = [e.screenX, e.screenY];
    }
    mousemove(e) {
        //ruch kamery - środkowy przycisk myszy
        if (this.isPressed.mmb) {
            if (this.isPressed.alt) {
                this.angleH -= 0.005 * this.moveSpeed * (e.screenX - this.prevPos[0]);
                this.angleV += 0.005 * this.moveSpeed * (e.screenY - this.prevPos[1]);
                if (this.angleV > 1.5) this.angleV = 1.5;
                if (this.angleV < 0.15) this.angleV = 0.15;
            }
            else {
                this.pointPos[0] -= this.moveSpeed * this.R / this.initR * (Math.cos(this.angleH) * (e.screenX - this.prevPos[0]) + Math.sin(this.angleH) * (e.screenY - this.prevPos[1]));
                this.pointPos[1] -= this.moveSpeed * this.R / this.initR * (Math.cos(this.angleH) * (e.screenY - this.prevPos[1]) - Math.sin(this.angleH) * (e.screenX - this.prevPos[0]));
            }
            this.prevPos[0] = e.screenX;
            this.prevPos[1] = e.screenY;
            this.refreshCamera();
        }
    }
    mouseup(e) { }
    wheel(e) {
        e.originalEvent.deltaY > 0 ?
            this.R *= e.originalEvent.deltaY * 0.012 * this.moveSpeed :
            this.R /= e.originalEvent.deltaY * -0.012 * this.moveSpeed;
        this.refreshCamera();
    }
    refreshCamera() {
        this.camera.position.set(
            this.R * Math.cos(this.angleV) * Math.sin(this.angleH) + this.pointPos[0],
            this.R * Math.sin(this.angleV),
            this.R * Math.cos(this.angleV) * Math.cos(this.angleH) + this.pointPos[1]
        );
        this.camera.lookAt(this.pointPos[0], 0, this.pointPos[1]);
        this.axesHelper.position.set(this.pointPos[0], 0, this.pointPos[1])
    }
}