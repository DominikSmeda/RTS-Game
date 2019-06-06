class CameraControl {

    constructor(parent) {
        this.x = parent.scene.canvas.width;
        this.y = parent.scene.canvas.height;
        this.parent = parent;

        this.prevPos = null;
        this.selBegin = null;
        this.selected = [];

        this.pointPos = [0, 0];
        this.R = 30;
        this.initR = 400;
        this.angleV = Math.PI / 3;
        this.angleH = 0;

        // prędkość przesuwania planszy
        this.moveSpeed = 1;

        this.camera = parent.camera;
        this.isPressed = parent.isPressed;

        this.axesHelper = new THREE.AxesHelper(10);
        parent.scene.add(this.axesHelper);

        this.refreshCamera();
    }
    mousedown(e) {
        if (e.button == 1)
            this.prevPos = [e.offsetX, e.offsetY];
    }
    mousemove(e) {
        //ruch kamery - środkowy przycisk myszy
        if (this.isPressed.mmb) {
            if (this.isPressed.alt) {
                this.angleH -= 0.005 * this.moveSpeed * (e.offsetX - this.prevPos[0]);
                this.angleV += 0.005 * this.moveSpeed * (e.offsetY - this.prevPos[1]);
                if (this.angleV > 1.5) this.angleV = 1.5;
                if (this.angleV < 0.15) this.angleV = 0.15;
            }
            else {
                this.pointPos[0] -= this.moveSpeed * this.R / this.initR * (Math.cos(this.angleH) * (e.offsetX - this.prevPos[0]) + Math.sin(this.angleH) * (e.offsetY - this.prevPos[1]));
                this.pointPos[1] -= this.moveSpeed * this.R / this.initR * (Math.cos(this.angleH) * (e.offsetY - this.prevPos[1]) - Math.sin(this.angleH) * (e.offsetX - this.prevPos[0]));
            }
            this.prevPos[0] = e.offsetX;
            this.prevPos[1] = e.offsetY;
            this.refreshCamera();
        }
    }
    mouseup(e) { }


    wheel(e) {
        Math.sign(e.originalEvent.deltaY) > 0 ?
            this.R *= 1.1 * this.moveSpeed :
            this.R /= 1.1 * this.moveSpeed;
        this.refreshCamera();
        //console.log(this.R)
    }
    refreshCamera() {
        this.camera.position.x = this.R * Math.cos(this.angleV) * Math.sin(this.angleH) + this.pointPos[0];
        this.camera.position.y = this.R * Math.sin(this.angleV);
        this.camera.position.z = this.R * Math.cos(this.angleV) * Math.cos(this.angleH) + this.pointPos[1];
        this.camera.lookAt(this.pointPos[0], 0, this.pointPos[1]);
        this.axesHelper.position.set(this.pointPos[0], 0, this.pointPos[1])
    }

    resizeCamera(x, y) {
        this.x = x;
        this.y = y;
        this.camera.aspect = x / y;
        this.camera.updateProjectionMatrix();
    }
}