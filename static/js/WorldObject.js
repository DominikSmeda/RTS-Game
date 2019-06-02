
//Klasa z której dziedziczą wszystkie Elementy które mozna umiescic na Terrain 
//Taka struktura ze np. Characters extends WordObject przyda mi się do pozycjonowania na terenie i w AssetsManagerze
class WorldObject extends THREE.Mesh {

    static getMeshModel(modelName) {
        console.log(MODELS[modelName]);

        return MODELS[modelName].mesh.clone();
    }

    constructor(modelName) {
        let mesh = WorldObject.getMeshModel(modelName);
        super(mesh.geometry, mesh.material);

        this.modelName = modelName;
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