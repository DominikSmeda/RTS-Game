
//Klasa z której dziedziczą wszystkie Elementy które mozna umiescic na Terrain 
//Taka struktura ze np. Characters extends WordObject przyda mi się do pozycjonowania na terenie i w AssetsManagerze
class WorldObject extends THREE.Object3D {

    static getMeshModel(modelName) {


        return MODELS[modelName].mesh.clone();
    }

    constructor(modelName) {
        let mesh = WorldObject.getMeshModel(modelName);
        super();
        this.add(mesh)
        this.modelName = modelName;

        // pozycja w grze
        this._netPosition = [0, 0];
        this.netId = this.uuid;
        this.type = 'WorldObject';
        this.className = this.constructor.toString().split(' ', 2)[1];
    }
    get netPosition() {
        return this._netPosition;
    }
    set netPosition(v) {
        this._netPosition[0] = v[0];
        this._netPosition[1] = v[1];
    }

    get netData() {
        return {
            position: this.netPosition,
            type: this.type,
            id: this.netId,
            className: this.className,
            modelName: this.modelName,
        }
    }
    set netData(data) {
        this.netPosition = data.position;
        this.type = data.type;
        this.netId = data.id;
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