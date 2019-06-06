//Klasa odpowiadająca za teren
//TODO: ACTIVE SELECTION IF IN SELECT AREA AND ADJUSTHEIGHT...()

class TerrainEditor extends THREE.Mesh {
    static getTerrainGeometry(width, heigt, wSegments, hSegments) {
        //funkcja jest po to by zwrócic plane ale juz obróconego poprawnie

        let plane = new THREE.Mesh(
            new THREE.PlaneGeometry(width, heigt, wSegments, hSegments)
        );

        //Dzięki temu nie tracimy orientacji xyz w swiecie po obrocie o 90stopni
        plane.rotation.set(-Math.PI / 2, 0, 0);
        plane.updateMatrix();
        plane.geometry.applyMatrix(plane.matrix);
        plane.rotation.set(0, 0, 0);
        plane.updateMatrix();

        return plane.geometry;
    }


    constructor(scene, width = 50, heigt = 50, wSegments = 300, hSegments = 300) {
        let material = SETTINGS.materials.terrain1;
        let geometry = TerrainEditor.getTerrainGeometry(width, heigt, wSegments, hSegments)

        super(geometry, material);

        this.scene = scene;
        this.brushSize = 3;

        this.castShadow = true;
        this.receiveShadow = true; // czy widac podswietlenie obszaru

        // this.selectAreaMesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({
        //     color: 0x0000ff,
        //     wireframe: false,
        //     transparent: true,
        //     opacity: 0.5
        // }));//obszar pokazujacy gdzie zmienimy wysokosc terenu

        this.brushIndex = 0;//ktory z tablicy brushesNames
        this.brushesNames = ["Circle", "Square", "Rectangle", "Mountain"];
        this.selectAreaMesh = new THREE.Mesh(TerrainEditor.getTerrainGeometry(width, heigt, wSegments, hSegments));
        this.scene.add(this.selectAreaMesh);

        this.addedObject = null;
        this.activeSelection;
        this.currentFunction = "None";
        this.init()
    }

    init() {
        // this.selectAreaMesh.visible = false
        this.activeSelection = false;

        // this.showUISettings() POTEM ODKOMENTOWAC
        this.keyboard();
    }

    startEditTerrainFunction() {
        this.currentFunction = "EditTerrain";
    }

    startAddObjectFunction(object) {
        if (this.addedObject) {
            this.scene.remove(this.addedObject)
        }
        this.currentFunction = "AddWorldObject";
        this.addedObject = object;
        this.addedObject.setMainModel();
        // this.addedObject.selected(true);
    }

    mouseClick(positionVec) {
        if (this.currentFunction == "None") return;
        if (this.currentFunction == "EditTerrain") {
            this.adjustHeightByPoint(positionVec);
            this.selectArea(positionVec);
        }
        if (this.currentFunction == "AddWorldObject") {
            this.addObjectToTerrain();
        }
    }

    mouseMove(positionVec) {
        if (this.currentFunction == "None") return;
        if (this.currentFunction == "EditTerrain") {
            // console.log(positionVec);

            this.selectArea(positionVec);
        }
        if (this.currentFunction == "AddWorldObject") {
            this.selectArea(positionVec, this.addedObject.brushName, this.addedObject.brushSize);
            this.setObjectOnArea(positionVec);
            this.scene.add(this.addedObject)
        }
    }

    adjustHeightByPoint(centerVec) {//mozna uzyc podczas klikniecia argument to intersects[0].point
        this.parent.updateMatrixWorld();//trzeba updatować inaczej nie działą
        let point = this.worldToLocal(centerVec);//konwertuje pozycje z swiata do lokalnego odpowiedznika tego samego miejsca

        for (let vert of this.geometry.vertices) {

            if (this.isVertexInArea(vert, point)) {

                vert.y += 1;

            }
        }
        this.geometry.verticesNeedUpdate = true;


        // this.material.map.needsUpdate = true;
    }


    selectArea(centerVec, brushName = this.brushesNames[this.brushIndex], brushSize = this.brushSize, endVec = null) {

        this.activeSelection = true;
        //mozna uzyc podczas mousemove argument to intersects[0].point
        this.parent.updateMatrixWorld();//trzeba updatować inaczej nie działą
        let point = this.worldToLocal(centerVec);//konwertuje pozycje z swiata do lokalnego odpowiedznika tego samego miejsca

        let vertices = [];

        for (let vert of this.geometry.vertices) {
            vertices.push(vert);
        }

        for (let i = 0; i < this.selectAreaMesh.geometry.vertices.length; i++) {

            if (this.isVertexInArea(vertices[i], point, brushName, brushSize, endVec)) {
                this.selectAreaMesh.geometry.vertices[i].copy(vertices[i]);
            }
            else {
                this.selectAreaMesh.geometry.vertices[i].set(point.x, 0, point.z)
            }
        }

        this.selectAreaMesh.geometry.verticesNeedUpdate = true;

        this.selectAreaMesh.position.y = 0.1;

        this.selectAreaMesh.material = SETTINGS.materials.select;

        this.selectAreaMesh.geometry.dispose()//podobno zwalnia troche RAMU.

    }

    isVertexInArea(vert, point, brushName = this.brushesNames[this.brushIndex], brushSize = this.brushSize, endVec = null) {

        switch (brushName) {
            case 'Circle': {
                if (Math.sqrt(Math.pow(vert.x - point.x, 2) + Math.pow(vert.z - point.z, 2)) <= brushSize / 2) {
                    return true;
                }
                break;
            }

            case 'Square': {
                if (point.x - brushSize / 2 < vert.x &&
                    point.x + brushSize / 2 > vert.x &&
                    point.z - brushSize / 2 < vert.z &&
                    point.z + brushSize / 2 > vert.z) {
                    return true;
                }

                break;
            }

            //brushSize koniec zaznaczenia
            case 'Rectangle': {

                function inRange(x, min, max) {
                    return ((x - min) * (x - max) <= 0);
                }

                let end = brushSize;
                let width = Math.abs(end.x - point.x);
                let height = Math.abs(end.z - point.z);
                // console.log(width, height);

                // if (Math.abs(vert.x - point.x) < width && Math.abs(vert.z - point.z) < height) {
                //     return true;
                // }
                if (inRange(vert.x, point.x, end.x) && inRange(vert.z, point.z, end.z)) {
                    return true;
                }

                break;
            }

        }

        return false;
    }

    showUISettings() {
        let div = $('<div class="terrainEditor">');
        div.html(`
        <input type="range" id="brush-size" value="1" min="1" max="20">Size</br>
        `)

        let select = $('<select id="brush-name">');
        for (let name of this.brushesNames) {
            let option = $(`<option>${name}</option>`)
            select.append(option);
        }
        div.append(select);
        $('body').append(div);

        $('body').on('input', '#brush-size', (e) => {

            this.brushSize = e.target.value;
            this.startEditTerrainFunction();
        })
        $('body').on('input', '#brush-name', (e) => {

            this.brushIndex = 0;
            for (let i = 0; i < this.brushesNames.length; i++) {
                if (this.brushesNames[i] == e.target.value) {
                    break;
                }
                this.brushIndex++;

            }
        })
        // div.draggable();
    }

    set activeSelection(bool) {
        this.selectAreaMesh.visible = bool;
    }

    get activeSelection() {
        return this.selectAreaMesh.visible;
    }

    checkAreaHeightEquality(centerVec, brushName, brushSize) {


    }


    addObjectToTerrain() {
        this.currentFunction = "None"
        this.addedObject.netPosition = [this.addedObject.position.x, this.addedObject.position.z];
        game.createObject(this.addedObject)

        setTimeout(() => {
            game.scene.remove(this.addedObject)
            this.addedObject.selected(false);
            this.addedObject = null;
            this.activeSelection = false;
        }, 150);//opoznienie by nie było znikniecia i pojawienia sie po czasie dodanego obiektu


    }

    setObjectOnArea(positionVec) {

        this.addedObject.position.copy(positionVec);
    }

    keyboard() {

        $(window).on('keydown', (e) => {
            if (e.code == "Escape") {
                this.currentFunction = "None";
                this.activeSelection = false;
                if (this.addedObject) {
                    this.scene.remove(this.addedObject)
                }
            }
        })

    }

    selectMouseArea(startX, startZ, endX, endZ) {
        console.log(endX);

        let start = new THREE.Vector3(startX, 0, startZ)
        let end = new THREE.Vector3(endX, 0, endZ)
        this.selectArea(start, 'Rectangle', end)
        //console.log(startX, startZ, endX, endZ);
        //tutaj moge zrobic pokazanie na terenie gdy ktoś zaznacza jednostki myszka
    }

    deselectArea() {
        this.activeSelection = false;
    }
}