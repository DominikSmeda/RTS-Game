class CameraControl {
    down = [false, false, false] //przyciski wciśnięte: lewy, środkowy, prawy myszki
    prevPos = null;

    moveSpeed = 1; // prędkość przesuwania planszy

    constructor(camera) {
        this.camera = camera;
    }
    mousedown(e) {
        switch (e.button) {
            case 0: //LPM
                this.down[0] = true;
                break;
            case 1: //ŚPM
                this.down[1] = true;
                this.prevPos = [e.screenX, e.screenY];
                break;
            case 2: //PPM
                this.down[2] = true;
                break;
        }
    }
    mousemove(e) {
        //ruch kamery - środkowy przycisk myszy
        if (this.down[1]) {
            this.camera.position.x -= this.moveSpeed * (e.screenX - this.prevPos[0]);
            this.camera.position.z -= this.moveSpeed * (e.screenY - this.prevPos[1]);
            this.prevPos[0] = e.screenX;
            this.prevPos[1] = e.screenY;
        }
    }
    mouseup(e) {
        switch (e.button) {
            case 0: //LPM
                this.down[0] = false;
                break;
            case 1: //ŚPM
                this.down[1] = false;
                break;
            case 2: //PPM
                this.down[2] = false;
                break;
        }
    }
}