
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
        this.net = {
            position: [0, 0],
            id: this.uuid,
            type: 'WorldObject',
            className: this.constructor.toString().split(' ', 2)[1],
            modelName: this.modelName,
        }
        /*  this._netPosition = [0, 0];
         this.netId = this.uuid;
         this.type = 'WorldObject';
         this.className = this.constructor.toString().split(' ', 2)[1]; */
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
        this.net = data;
    }

    // eventy: jednorazowy i przy renderze
    onDataUpdate() {
        this.calculatePosition();
    }

    onRender() { }

    calculatePosition() {
        this.position.x = this.netPosition[0];
        this.position.z = this.netPosition[1];
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