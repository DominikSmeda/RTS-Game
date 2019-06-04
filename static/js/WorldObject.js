
//Klasa z której dziedziczą wszystkie Elementy które mozna umiescic na Terrain 
//Taka struktura ze np. Characters extends WordObject przyda mi się do pozycjonowania na terenie i w AssetsManagerze
class WorldObject extends THREE.Object3D {

    static getMeshModel(modelName) {


        return MODELS[modelName].mesh.clone();
    }

    constructor(modelName = null) {
        super();
        if (modelName) {
            let mesh = WorldObject.getMeshModel(modelName);
            this.add(mesh);
            this.modelName = modelName;
        }
        else this.modelName = 'tree1';

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
            modelName: this.modelName,
            owner: 'ambient',
        }
    }
    get netPosition() {
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
    }

    // eventy: 
    /*  onGameTick() { //z każdym tickiem od serwera
         nieobsługiwany
     } */
    onDataUpdate() { //jeśli zmienią się dane
        this.calculatePosition();
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

    setMeshModel(modelName) {
        let mesh = MODELS[modelName].mesh.clone();
        this.geometry = mesh.geometry;
        this.material = mesh.material;
        this.modelName = modelName;
    }

    set meshInitScale(s) {
        this.scale.set(s, s, s);
    }

    get meshInitScale() {
        return this.scale;
    }

}