class ClickRegister {

    //Wywołanie: [object].ctrl, [object].lpm, itp.

    //przyciski wciśnięte: lewy, środkowy, prawy myszki
    //ctrl, alt, shift

    constructor() {
        this.mouse = [false, false, false];
        this.special = [false, false, false];
        this.lastEvent = null;
    }
    mousedown(e) {
        this.lastEvent = e;
        switch (e.button) {
            case 0: //LPM
                this.mouse[0] = true;
                break;
            case 1: //ŚPM
                this.mouse[1] = true;
                this.prevPos = [e.screenX, e.screenY];
                break;
            case 2: //PPM
                this.mouse[2] = true;
                break;
        }
    }
    mousemove(e) {
        this.lastEvent = e;
    }
    mouseup(e) {
        this.lastEvent = e;
        e.preventDefault();
        switch (e.button) {
            case 0: //LPM
                this.mouse[0] = false;
                break;
            case 1: //ŚPM
                this.mouse[1] = false;
                break;
            case 2: //PPM
                this.mouse[2] = false;
                break;
        }
    }
    keydown(e) {
        this.lastEvent = e;
        switch (e.key) {
            case "Control":
                this.special[0] = true;
                break;
            case "Alt":
                this.special[1] = true;
                break;
            case "Shift":
                this.special[2] = true;
                break;
        }
    }
    keyup(e) {
        this.lastEvent = e;
        switch (e.key) {
            case "Control":
                this.special[0] = false;
                break;
            case "Alt":
                this.special[1] = false;
                break;
            case "Shift":
                this.special[2] = false;
                break;
        }
    }

    get lmb() { return this.mouse[0] } //lewy
    get mmb() { return this.mouse[1] } //środkowy
    get rmb() { return this.mouse[2] } //prawy

    get ctrl() { return this.special[0] } //środkowy
    get alt() { return this.special[1] } //środkowy
    get shift() { return this.special[2] } //środkowy
}