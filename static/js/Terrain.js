//Klasa odpowiadająca za teren


class Terrain extends THREE.Mesh {
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


    constructor(scene) {
        let material = SETTINGS.materials.terrain1;
        let geometry = Terrain.getTerrainGeometry(50, 50, 300, 300)

        super(geometry, material);

        this.scene = scene;
        this.brushSize = 3;

        this.castShadow = true;
        this.receiveShadow = true;

        this.selectAreaMesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            wireframe: false,
            transparent: true,
            opacity: 0.5
        }));//obszar pokazujacy gdzie zmienimy wysokosc terenu
        this.brushIndex = 0;//ktory z tablicy brushesNames
        this.brushesNames = ["Circle", "Rectangle", "Ring", "Mountain"];
        this.select = new THREE.Mesh(Terrain.getTerrainGeometry(50, 50, 300, 300), new THREE.MeshBasicMaterial({ color: 0x000000 }));
        scene.add(this.select)
        this.init()
    }

    init() {

        this.showUISettings()
    }

    adjustHeightByPoint(placeVec) {//mozna uzyc podczas klikniecia argument to intersects[0].point
        this.parent.updateMatrixWorld();//trzeba updatować inaczej nie działą
        let point = this.worldToLocal(placeVec);//konwertuje pozycje z swiata do lokalnego odpowiedznika tego samego miejsca

        for (let vert of this.geometry.vertices) {

            if (this.isVertexInArea(vert, point)) {

                vert.y += 1;

            }
        }
        this.geometry.verticesNeedUpdate = true;


        // this.material.map.needsUpdate = true;
    }


    selectArea(placeVec) {//mozna uzyc podczas mousemove argument to intersects[0].point
        this.parent.updateMatrixWorld();//trzeba updatować inaczej nie działą
        let point = this.worldToLocal(placeVec);//konwertuje pozycje z swiata do lokalnego odpowiedznika tego samego miejsca

        let vertices = [];

        for (let vert of this.geometry.vertices) {
            vertices.push(vert);
        }

        for (let i = 0; i < this.select.geometry.vertices.length; i++) {

            if (this.isVertexInArea(vertices[i], point)) {
                this.select.geometry.vertices[i].copy(vertices[i]);
            }
            else {
                this.select.geometry.vertices[i].set(point.x, 0, point.z)
            }
        }

        this.select.geometry.verticesNeedUpdate = true;

        this.select.position.y = 0.1;

        this.select.material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            wireframe: false,
            transparent: true,
            opacity: 0.5
        })

        this.select.geometry.dispose()//podobno zwalnia troche RAMU.

    }

    isVertexInArea(vert, point) {

        switch (this.brushesNames[this.brushIndex]) {
            case 'Circle': {
                if (Math.sqrt(Math.pow(vert.x - point.x, 2) + Math.pow(vert.z - point.z, 2)) <= this.brushSize / 2) {
                    return true;
                }
                break;
            }

            case 'Rectangle': {
                if (point.x - this.brushSize / 2 < vert.x &&
                    point.x + this.brushSize / 2 > vert.x &&
                    point.z - this.brushSize / 2 < vert.z &&
                    point.z + this.brushSize / 2 > vert.z) {
                    return true;
                }

                break;
            }
        }

        return false;
    }

    showUISettings() {
        let div = $('<div class="ui-settings">');
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
            console.log(e.target.value);
            this.brushSize = e.target.value;
        })
        $('body').on('input', '#brush-name', (e) => {
            console.log(e.target.value);
            this.brushIndex = 0;
            for (let i = 0; i < this.brushesNames.length; i++) {
                if (this.brushesNames[i] == e.target.value) {
                    break;
                }
                this.brushIndex++;

            }
        })

    }


}