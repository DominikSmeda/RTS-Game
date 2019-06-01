class CameraControl {
    down = [false, false, false] //przyciski wciśnięte: lewy, środkowy, prawy myszki
    prevPos = null;

    pointPos = [0, 0];
    R = 400
    angleV = Math.PI / 4
    angleH = 0

    axesHelper = new THREE.AxesHelper(10);

    moveSpeed = 1; // prędkość przesuwania planszy

    constructor(parent) {
        console.log(parent.isPressed)
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
            if (this.isPressed.ctrl) {
                this.angleH -= 0.005 * this.moveSpeed * (e.screenX - this.prevPos[0]);
                this.angleV += 0.005 * this.moveSpeed * (e.screenY - this.prevPos[1]);
                if (this.angleV > 1.5) this.angleV = 1.5;
                if (this.angleV < 0.15) this.angleV = 0.15;
            }
            else {
                this.pointPos[0] -= Math.cos(this.angleH) * this.moveSpeed * (e.screenX - this.prevPos[0]) + Math.sin(this.angleH) * this.moveSpeed * (e.screenY - this.prevPos[1]);
                this.pointPos[1] -= Math.cos(this.angleH) * this.moveSpeed * (e.screenY - this.prevPos[1]) - Math.sin(this.angleH) * this.moveSpeed * (e.screenX - this.prevPos[0]);
            }
            this.prevPos[0] = e.screenX;
            this.prevPos[1] = e.screenY;
            this.refreshCamera();
        }
    }
    mouseup(e) { }
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