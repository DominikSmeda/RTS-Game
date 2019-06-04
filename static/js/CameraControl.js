class CameraControl {

    constructor(parent) {
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();

        this.x = parent.scene.canvas.width;
        this.y = parent.scene.canvas.height;
        this.parent = parent;

        this.prevPos = null;
        this.selBegin = null;
        this.selected = [];

        this.pointPos = [0, 0];
        this.R = 100;
        this.initR = 400;
        this.angleV = Math.PI / 3;
        this.angleH = 0;

        // prędkość przesuwania planszy
        this.moveSpeed = 1;

        this.camera = parent.camera;
        this.isPressed = parent.isPressed;

        this.axesHelper = new THREE.AxesHelper(10);
        parent.scene.add(this.axesHelper);

        // płaszczyzna wykrywania kliknięcia
        this.clickPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(10000, 10000, 1),
            new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0 })
        );
        this.clickPlane.rotation.set(Math.PI / 2, 0, 0);
        parent.scene.add(this.clickPlane);
        this.refreshCamera();
    }
    mousedown(e) {
        if (e.button == 1)
            this.prevPos = [e.offsetX, e.offsetY];
        else if (e.button == 0) this.beginSelection(e);
        else if (e.button == 2) this.issueMove(e);
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
        if (this.isPressed.lmb) this.moveSelection(e);
    }
    mouseup(e) {
        if (e.button == 0) this.endSelection(e);
    }

    // Wybieranie jednostek
    beginSelection(e) {
        //this.selected = [];
        this.selBegin = [e.offsetX, e.offsetY];
        console.log(this.selBegin)
    }

    moveSelection(e) { // interaktywne zaznaczanie itp.

    }

    endSelection(e) {
        var add = true
        if (!this.isPressed.shift) {
            add = false;
            this.selected = [];
        }
        this.mouseVector.x = (this.selBegin[0] / this.x) * 2 - 1;
        this.mouseVector.y = -(this.selBegin[1] / this.y) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        var inter1 = this.raycaster.intersectObject(this.clickPlane);
        if (inter1.length < 1) return;
        //var begin = [inter[0].point.x, inter[0].point.z];

        this.mouseVector.x = (e.offsetX / this.x) * 2 - 1;
        this.mouseVector.y = -(e.offsetY / this.y) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        var inter2 = this.raycaster.intersectObject(this.clickPlane);
        if (inter2.length < 1) return;
        //var end = [inter[0].point.x, inter[0].point.z];

        if (Math.abs(this.selBegin[0] - e.offsetX) < 3 && Math.abs(this.selBegin[1] - e.offsetY) < 3) {
            //pojedyncze kliknięcie
            var points = [
                inter2[0].point.x - 2,
                inter2[0].point.z - 2,
                inter2[0].point.x + 2,
                inter2[0].point.z + 2,
            ];
            var solo = true;
        }
        else var points = [
            Math.min(inter1[0].point.x, inter2[0].point.x),
            Math.min(inter1[0].point.z, inter2[0].point.z),
            Math.max(inter1[0].point.x, inter2[0].point.x),
            Math.max(inter1[0].point.z, inter2[0].point.z),
        ];
        if (add) for (let i = 0; i < this.parent.objects.characters.length; i++) {
            const el = this.parent.objects.characters[i];
            if (el.position.x > points[0]
                && el.position.x < points[2]
                && el.position.z > points[1]
                && el.position.z < points[3]) {
                var flag = true;
                for (let i = 0; i < this.selected.length; i++) {
                    if (this.selected[i].net.id == el.net.id) {
                        flag = false;
                        break;
                    };
                }
                if (flag) this.selected.push(el);
                if (solo) break;
            }
        }
        else for (let i = 0; i < this.parent.objects.characters.length; i++) {
            const el = this.parent.objects.characters[i];
            if (el.position.x > points[0]
                && el.position.x < points[2]
                && el.position.z > points[1]
                && el.position.z < points[3]) {
                this.selected.push(el)
                if (solo) break;
            }
        }
    }

    spacing = 5;
    issueMove(e) {
        if (this.selected.length < 1) return;
        this.mouseVector.x = (e.offsetX / this.x) * 2 - 1;
        this.mouseVector.y = -(e.offsetY / this.y) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        var inter1 = this.raycaster.intersectObject(this.clickPlane);
        if (inter1.length < 1) return;
        var pos = [inter1[0].point.x, inter1[0].point.z]

        var l = Math.ceil(Math.sqrt(this.selected.length));
        var off = (l - 1) / 2 * this.spacing;
        for (let i = 0; i < this.selected.length; i++) {
            //this.parent.net.move(
            this.selected[i].move(
                pos[0] + i % l * this.spacing - off,
                pos[1] + parseInt(i / l) * this.spacing - off
            )
            //);
        }
    }


    wheel(e) {
        e.originalEvent.deltaY > 0 ?
            this.R *= e.originalEvent.deltaY * 0.012 * this.moveSpeed :
            this.R /= e.originalEvent.deltaY * -0.012 * this.moveSpeed;
        this.refreshCamera();
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