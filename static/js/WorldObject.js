
//Klasa z której dziedziczą wszystkie Elementy które mozna umiescic na Terrain 
//Taka struktura ze np. Characters extends WordObject przyda mi się do pozycjonowania na terenie i w AssetsManagerze
class WorldObject extends THREE.Object3D {

    static getMeshModel(modelName) {
        return MODELS[modelName].mesh.clone();
    }

    constructor(modelName = null) {
        super();
        // if (modelName) {
        //     let mesh = WorldObject.getMeshModel(modelName);
        //     this.add(mesh);
        //     this.modelName = modelName;
        // }
        // else this.modelName = 'tree1';

        this.justCreated = true;
        // dane do serwera
        this.net = {
            position: [0, 0],
            id: this.uuid,
            type: 'WorldObject',
            className: this.constructor.toString().split(' ', 2)[1],
            modelName: modelName,
            owner: 'ambient',//ambient -> neutralny obiekt
        }

        this.selectedMesh;//
        this.mainModel;//głowny model
        /*  this._netPosition = [0, 0];
         this.netId = this.uuid;
         this.type = 'WorldObject';
         this.className = this.constructor.toString().split(' ', 2)[1]; */
    }
    get netPosition() {//
        return this.net.position;
    }
    set netPosition(v) {
        this.net.position[0] = v[0];
        this.net.position[1] = v[1];
    }

    get netData() {
        return this.net;
    }
    set netData(data) {
        this.net = data;
        //this.onDataUpdate()    <- Tutaj dałbym tak zeby nie powielac i nie zapomniec czasem tej funkcji
    }

    // eventy: jednorazowy i przy renderze
    onDataUpdate() {
        this.calculatePosition();
        if (this.justCreated) {
            this.setMainModel();
        }


    }

    onRender() { }

    calculatePosition() {
        this.position.x = this.netPosition[0];
        this.position.z = this.netPosition[1];
    }

    setMainModel() {
        this.mainModel = WorldObject.getMeshModel(this.net.modelName);
        this.add(this.mainModel);
    }

    set meshInitScale(s) {
        this.scale.set(s, s, s);
    }

    get meshInitScale() {
        return this.scale;
    }

    selected(bool) {//pokazanie ze obiekt zostal zaznaczony 
        if (bool) {
            this.updateMatrix()
            this.selectedMesh = this.mainModel.clone();
            // this.selectedMesh = this.selectedMesh.children[0]
            this.selectedMesh.scale.set(1.05, 1.05, 1.5);
            //narazie nie równe ma pozycje ale to prowdopodobnie przez przsuniety model pracuje nad tym...
            this.selectedMesh.material = SETTINGS.materials.selectedObject;
            console.log(this.selectedMesh);

            this.add(this.selectedMesh);
        }
        else {
            this.remove(this.selectedMesh);
        }
    }
}


