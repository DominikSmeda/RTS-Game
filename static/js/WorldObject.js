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
        this.dead = false;
        this.mine = false;

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
            canBeDamaged: false,
            hp: 100,
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
        this.net.position = v;
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
            if (this.net.owner == game.playerID) this.mine = true;
            this.setMainModel();
        }
        if (this.net.hp <= 0 && !this.dead) {
            this.dead = true;
            this.onDeath();
        }
    }
    onRender() { } //co klatkę obrazu

    onDeath() { //raz przy śmierci
        console.log(this.net.id + ' zginął');
        game.scene.remove(this);
    }


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

    setMeshModel(modelName) {
        let mesh = MODELS[modelName].mesh.clone();
        this.geometry = mesh.geometry;
        this.material = mesh.material;
        this.modelName = modelName;
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
            //console.log(this.selectedMesh);

            this.add(this.selectedMesh);
        }
        else {
            this.remove(this.selectedMesh);
        }
    }

    createHealthBar() {
        //TODO
    }
}


