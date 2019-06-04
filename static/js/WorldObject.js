
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
        // UWAGA: przy edycji zmień this.edited na true!
        this.edited = false;
        this.lastNet = null;
        this.net = {
            position: [0, 0],
            id: this.uuid,
            type: 'WorldObject',
            className: this.constructor.toString().split(' ', 2)[1],
            modelName: modelName,
            owner: 'ambient',//ambient -> neutralny obiekt
        }

        this.meshInitScale = 1;//skala modelu w swiecie
        this.assetsManagerInitScale = 1;//skala modelu w Ass
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
        this.lastNet = JSON.parse(JSON.stringify(data));
        this.net = data;
        this.onDataUpdate()
    }

    // eventy: 
    /*  onGameTick() { //z każdym tickiem od serwera
         nieobsługiwany
     } */
    onDataUpdate() { //jeśli zmienią się dane
        this.calculatePosition();
        if (this.justCreated) {
            this.setMainModel();
        }
    }
    onRender() { } //co klatkę obrazu



    calculatePosition() {
        this.position.x = this.netPosition[0];
        this.position.z = this.netPosition[1];
    }

    sendEdit() { // wyślij tylko wyedytowane dane
        if (!this.edited) return;
        var toSend = {
            id: this.net.id,
            type: this.net.type,
        };
        for (let i = 0; i < Object.keys(this.net).length; i++) {
            const k = Object.keys(this.net)[i];
            if (!this.lastNet[k]) toSend[k] = this.net[k];
            else {
                if (this.lastNet[k] == this.net[k]) continue;
                if (JSON.stringify(this.lastNet[k]) == JSON.stringify(this.net[k])) continue;
                toSend[k] = this.net[k];
            }
        }
        if (Object.keys(toSend).length > 2) game.net.update(toSend);
        this.edited = false;
    }


    setMainModel() {
        this.mainModel = WorldObject.getMeshModel(this.net.modelName);
        this.add(this.mainModel);
        this.mainModel.scale.set(this.meshInitScale, this.meshInitScale, this.meshInitScale)
    }

    selected(bool) {//pokazanie ze obiekt zostal zaznaczony 
        if (bool) {
            // this.updateMatrix()
            // this.selectedMesh = this.mainModel.clone();
            this.selectedMesh = this.mainModel.children[0].clone();
            // this.selectedMesh.scale.set(1, 1, 1)
            // console.log(this.selectedMesh);
            // this.selectedMesh.scale.copy(this.selectedMesh.scale)
            // this.selectedMesh.scale.set(1., 1.05, 1.5);
            // this.selectedMesh.scale.set(this.meshInitScale, this.meshInitScale, this.meshInitScale)
            //narazie nie równe ma pozycje ale to prowdopodobnie przez przsuniety model pracuje nad tym...
            this.selectedMesh.material = SETTINGS.materials.selectedObject;
            // console.log(this.selectedMesh.scale.copy(this.scale));
            this.selectedMesh.scale.y += 0.0005;
            this.selectedMesh.scale.x += 0.0005;
            this.selectedMesh.scale.z += 0.0005;

            //console.log(this.selectedMesh);

            this.add(this.selectedMesh);
        }
        else {
            this.remove(this.selectedMesh);
        }
    }
}


