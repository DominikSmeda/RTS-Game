//Klasa z której dziedziczą wszystkie Elementy które mozna umiescic na Terrain 
//Taka struktura ze np. Characters extends WordObject przyda mi się do pozycjonowania na terenie i w AssetsManagerze
class WorldObject extends THREE.Object3D {

    static getMeshModel(modelName) {

        if (MODELS[modelName].skinned) {
            return THREE.SkeletonUtils.clone(MODELS[modelName].model);
        }
        else {
            return MODELS[modelName].model.clone();
        }

    }

    constructor(modelName = null) {
        super();
        this.modelName = modelName;
        // if (modelName) {
        //     let mesh = WorldObject.getMeshModel(modelName);
        //     this.add(mesh);
        //     this.modelName = modelName;
        // }
        // else this.modelName = 'tree1';

        this.justCreated = false;
        this.dead = false;
        //this.mine = false; // zmieniono na gettera

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
            color: 0x444444,
            hp: 100,
        }
        this.baseHP = 100;
        this.HP = 100; // Nie musisz ustawiać wszystkich HP ręcznie - wywołaj setter HP!

        this.name = 'default'; //Nazwa jednostki wyświetlana w grze
        this.cost = 10; //koszt jednostki


        this.meshInitScale = 1;//skala modelu w swiecie
        this.assetsManagerInitScale = 1;//skala modelu w Ass
        this.selectedMesh;//
        this.mainModel;//głowny model

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

    get mine() {
        return this.net.owner == game.playerID;
    }

    /**
     * @param {Number} v
     */
    set HP(v) {
        this.baseHP = this.net.hp = v;
    }

    // eventy: 
    onGameTick() { } //z każdym tickiem od serwera

    onDataUpdate() { //jeśli zmienią się dane
        this.calculatePosition();
        if (this.justCreated) {
            //console.log(this.justCreated)
            //if (this.net.owner == game.playerID) this.mine = true;
            this.createHealthBar();
            this.setMainModel();
        }
        if (this.net.hp <= 0 && !this.dead) {
            this.dead = true;
            this.onDeath();
        }
        this.updateHealthBar();
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


    setMainModel() {
        this.mainModel = WorldObject.getMeshModel(this.net.modelName);

        this.add(this.mainModel);
        this.mainModel.scale.set(this.meshInitScale, this.meshInitScale, this.meshInitScale)

        this.onModelLoaded()
    }

    onModelLoaded() {
        //funkcje pusta -> mogą nadpisywac potomkowie
    }

    selected(bool) {//pokazanie ze obiekt zostal zaznaczony 
        if (bool) {

            var box = new THREE.Box3().setFromObject(this.mainModel);
            let x = box.getSize().x;
            var geometry = new THREE.RingGeometry(x * 0.7, x * 1.2, 6);

            this.selectedMesh = new THREE.Mesh(geometry, SETTINGS.materials.selectedObject);
            this.selectedMesh.rotation.x = Math.PI / 2
            this.selectedMesh.position.y += 0.001;
            this.add(this.selectedMesh);
        }
        else {
            this.remove(this.selectedMesh);
        }
    }

    updateHealthBar() {
        this.hpBar.scale.x = 3 * this.net.hp / this.baseHP;
        //this.hpBar.position.y += 0.1;
    }

    createHealthBar() {
        //console.log('created', this.net.hp, this.baseHP, this.justCreated)
        this.hpSpriteMaterial = new THREE.SpriteMaterial({ color: this.net.color });
        this.hpBar = new THREE.Sprite(this.hpSpriteMaterial);;
        this.hpBar.position.x = -1.5;
        this.hpBar.position.y += 2;
        // this.hpBar.scale.x = 3.5;
        this.hpBar.scale.x = 3 * this.net.hp / this.baseHP;
        this.hpBar.scale.y = 0.4;
        this.hpBar.center.x = 0;
        this.add(this.hpBar);
    }
}


