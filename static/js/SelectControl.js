class SelectControl {
    constructor(parent) {
        this.parent = parent;
        this.camera = parent.camera;
        this.isPressed = parent.isPressed;
        this.spacing = 5;

        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2();

        this.c_selBegin = null;
        this.selBegin = null;
        this.selected = [];

        this.clickPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(10000, 10000, 1),
            new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0 })
        );
        this.clickPlane.rotation.set(Math.PI / 2, 0, 0);
        this.parent.scene.add(this.clickPlane);
    }
    get x() {
        return this.parent.scene.canvas.width;
    }
    get y() {
        return this.parent.scene.canvas.height;
    }

    //eventy
    mousedown(e) {
        if (e.button == 0) this.beginSelection(e);
        else if (e.button == 2) this.issueAction(e);
    }
    mousemove(e) {
        if (this.isPressed.lmb) this.moveSelection(e);
    }
    mouseup(e) {
        if (e.button == 0) this.endSelection(e);
    }

    // Wybieranie jednostek
    beginSelection(e) {
        this.c_selBegin = [e.offsetX, e.offsetY];

        this.mouseVector.x = (e.offsetX / this.x) * 2 - 1;
        this.mouseVector.y = -(e.offsetY / this.y) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        var inter1 = this.raycaster.intersectObject(this.clickPlane);
        if (inter1.length < 1) return;
        this.selBegin = [inter1[0].point.x, inter1[0].point.z];
    }

    moveSelection(e) { // interaktywne zaznaczanie itp.
        if (this.selBegin) {
            this.mouseVector.x = (e.offsetX / this.x) * 2 - 1;
            this.mouseVector.y = -(e.offsetY / this.y) * 2 + 1;
            this.raycaster.setFromCamera(this.mouseVector, this.camera);
            var inter2 = this.raycaster.intersectObject(this.clickPlane);
            if (inter2.length < 1) return;

            this.parent.mainTerrain.selectMouseArea(
                this.selBegin[0],
                this.selBegin[1],
                inter2[0].point.x,
                inter2[0].point.z
            );
        }
    }

    canBeSelected(obj) {
        if (!(obj instanceof GameObject) ||
            obj.net.owner != this.parent.playerID)
            return false;
        return true;
    }

    endSelection(e) {
        if (!this.selBegin) return;
        this.parent.mainTerrain.deselectArea();
        console.log('ENDDD');

        var endSel = this.selBegin;
        this.selBegin = null;
        var add = true;
        var solo = false;
        if (!this.isPressed.shift) {
            for (let i = 0; i < this.selected.length; i++) {
                this.selected[i].selected(false);
            }
            add = false;
            this.selected = [];
        }
        if (Math.abs(this.c_selBegin[0] - e.offsetX) < 3 && Math.abs(this.c_selBegin[1] - e.offsetY) < 3) {
            //pojedyncze kliknięcie
            this.mouseVector.x = (e.offsetX / this.x) * 2 - 1;
            this.mouseVector.y = -(e.offsetY / this.y) * 2 + 1;
            this.raycaster.setFromCamera(this.mouseVector, this.camera);
            var inter3 = this.raycaster.intersectObjects(this.parent.objects.characters, true);
            if (inter3.length < 1) return;
            var el = inter3[0].object.parent
            if (!(el instanceof WorldObject)) el = el.parent;
            console.log(el);
            if (/* el instanceof WorldObject &&  */this.canBeSelected(el)) {
                el.selected(true);
                this.selected.push(el);
            };
            return;
        }

        this.mouseVector.x = (e.offsetX / this.x) * 2 - 1;
        this.mouseVector.y = -(e.offsetY / this.y) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        var inter2 = this.raycaster.intersectObject(this.clickPlane);
        if (inter2.length < 1) return;

        /* if (Math.abs(this.selBegin[0] - e.offsetX) < 3 && Math.abs(this.selBegin[1] - e.offsetY) < 3) {
            //pojedyncze kliknięcie
            var points = [
                inter2[0].point.x - 2,
                inter2[0].point.z - 2,
                inter2[0].point.x + 2,
                inter2[0].point.z + 2,
            ];
            var solo = true;
        }
        else */ var points = [
            Math.min(endSel[0], inter2[0].point.x),
            Math.min(endSel[1], inter2[0].point.z),
            Math.max(endSel[0], inter2[0].point.x),
            Math.max(endSel[1], inter2[0].point.z),
        ];
        if (add) for (let i = 0; i < this.parent.objects.characters.length; i++) {
            const el = this.parent.objects.characters[i];
            if (el.position.x > points[0]
                && el.position.x < points[2]
                && el.position.z > points[1]
                && el.position.z < points[3]) {
                if (!this.canBeSelected(el)) continue;
                var flag = true;
                for (let i = 0; i < this.selected.length; i++) {
                    if (this.selected[i].net.id == el.net.id) {
                        flag = false;
                        break;
                    };
                }
                if (flag) {
                    el.selected(true);
                    this.selected.push(el)
                };
                if (solo) break;
            }
        }
        else for (let i = 0; i < this.parent.objects.characters.length; i++) {
            const el = this.parent.objects.characters[i];
            if (el.position.x > points[0]
                && el.position.x < points[2]
                && el.position.z > points[1]
                && el.position.z < points[3]) {
                if (!this.canBeSelected(el)) continue;
                el.selected(true);
                this.selected.push(el)
                if (solo) break;
            }
        }
    }


    issueAction(e) {
        if (this.selected.length < 1) return;

        // czy jest kliknięty wróg
        this.mouseVector.x = (e.offsetX / this.x) * 2 - 1;
        this.mouseVector.y = -(e.offsetY / this.y) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        var inter1 = this.raycaster.intersectObjects(this.parent.objects.characters, true);

        if (inter1.length > 0) {
            var el = inter1[0].object.parent;
            if (!(el instanceof WorldObject)) el = el.parent;
            if (el instanceof GameObject && el.net.owner != this.parent.playerID) {
                for (let i = 0; i < this.selected.length; i++) {
                    console.log('attack', el.net.owner, this.parent.playerID)
                    this.selected[i].edited = true;
                    this.selected[i].net.attackDest = el.net.id;
                    this.selected[i].net.destination = el.net.position;
                    this.selected[i].net.destinationID = el.net.id;
                }
                return;
            }
        }
        // 
        this.mouseVector.x = (e.offsetX / this.x) * 2 - 1;
        this.mouseVector.y = -(e.offsetY / this.y) * 2 + 1;
        this.raycaster.setFromCamera(this.mouseVector, this.camera);
        var inter1 = this.raycaster.intersectObject(this.clickPlane);
        if (inter1.length < 1) return;
        var pos = [inter1[0].point.x, inter1[0].point.z]

        var l = Math.ceil(Math.sqrt(this.selected.length));
        var off = (l - 1) / 2 * this.spacing + 0;
        for (let i = 0; i < this.selected.length; i++) {
            //this.parent.net.move(
            this.selected[i].edited = true;
            if (this.isPressed.shift) this.selected[i].net.attackMove = true;
            this.selected[i].move(
                pos[0] + i % l * this.spacing - off - 0.5,
                pos[1] + parseInt(i / l) * this.spacing - off + 0.5
            );
            this.selected[i].net.attackDest = null;
            //);
        }

    }
}