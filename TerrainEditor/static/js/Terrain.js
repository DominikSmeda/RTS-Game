//Texture need update
let texture = new THREE.TextureLoader().load("texture.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(50, 50);

//funkcja jest po to by zwrócic plane ale juz obróconego poprawnie
function getTerrainGeometry(width, heigt, wSegments, hSegments) {
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


class Terrain extends THREE.Mesh {
    constructor(scene) {
        let material = new THREE.MeshPhongMaterial({

            wireframe: false,
            map: texture
        });
        let geometry = getTerrainGeometry(50, 50, 300, 300)

        super(geometry, material);

        this.scene = scene;
        this.adjustTerrainRadius = 3;

        this.castShadow = true;
        this.receiveShadow = true;

        this.selectAreaMesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            wireframe: false,
            transparent: true,
            opacity: 0.5
        }));//obszar pokazujacy gdzie zmienimy wysokosc terenu
        this.select = new THREE.Mesh(getTerrainGeometry(50, 50, 300, 300));
        scene.add(this.select)
        this.init()
    }

    init() {

    }

    adjustHeightByPoint(placeVec) {
        this.parent.updateMatrixWorld();//trzeba updatować inaczej nie działą
        let point = this.worldToLocal(placeVec);//konwertuje pozycje z swiata do lokalnego odpowiedznika tego samego miejsca

        for (let vert of this.geometry.vertices) {
            if (Math.sqrt(Math.pow(vert.x - point.x, 2) + Math.pow(vert.z - point.z, 2)) <= this.adjustTerrainRadius) {
                // console.log(vert);
                vert.y += 1;

            }
        }
        this.geometry.verticesNeedUpdate = true
        // this.material.map.needsUpdate = true;
    }

    selectArea(placeVec, face) {
        // this.parent.updateMatrixWorld();
        // let point = this.worldToLocal(placeVec);
        this.selectArea2(placeVec)
        return;
        this.scene.remove(this.select);

        let point = placeVec;

        let vertices = [];
        for (let vert of this.geometry.vertices) {
            if (Math.sqrt(Math.pow(vert.x - point.x, 2) + Math.pow(vert.z - point.z, 2)) <= this.adjustTerrainRadius) {
                let v = vert.clone()
                vertices.push(v);

            }
        }
        console.log(vertices.length);
        let size = Math.floor(Math.sqrt(vertices.length));
        console.log(size);


        let geometry = getTerrainGeometry(6, 6, size, size);
        let select = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            wireframe: false,
            transparent: true,
            opacity: 0.5
        }));

        for (let i = 0; i < select.geometry.vertices.length; i++) {
            // select.geometry.vertices[i].copy(vertices[i]);
            if (i < vertices.length) {
                select.geometry.vertices[i].y = vertices[i].y + 0.1;
            }
        }

        select.geometry.verticesNeedUpdate = true;
        select.position.y += 0.0001;

        select.position.x = point.x;
        select.position.z = point.z;
        // select.scale.set(1.01, 1.01, 1.01)
        this.select = select;
        this.scene.add(this.select)

    }

    selectArea2(placeVec) {

        let point = placeVec;

        let vertices = [];

        // this.updateMatrix();
        // let mesh = this.clone();
        // this.select.geometry.applyMatrix(this.geometry);
        // this.select.updateMatrix();

        // this.select.matrixAutoUpdate = false;

        var newMat = new THREE.Matrix4();
        // console.log(this.matrix.elements
        // output: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
        // newMat = newMat.copy(this.matrix);
        // console.log(newMat);


        for (let vert of this.geometry.vertices) {

            vertices.push(vert);

            // }
        }

        for (let i = 0; i < this.select.geometry.vertices.length; i++) {
            // select.geometry.vertices[i].copy(vertices[i]);
            // if (i < vertices.length) {
            if (Math.sqrt(Math.pow(vertices[i].x - point.x, 2) + Math.pow(vertices[i].z - point.z, 2)) <= this.adjustTerrainRadius) {
                this.select.geometry.vertices[i].copy(vertices[i]);
                // }
            }
            else {
                this.select.geometry.vertices[i].set(point.x, 0, point.z)
            }
        }

        this.select.geometry.verticesNeedUpdate = true;
        // this.select.geometry.computeFaceNormals();
        // this.select.position.x = point.x;
        // this.select.position.z = point.z;
        this.select.position.y = 0.1;
        // this.select.updateMatrix();



        this.select.material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            wireframe: false,
            transparent: true,
            opacity: 0.5
        })

        // this.select.geometry.dispose()

    }

}