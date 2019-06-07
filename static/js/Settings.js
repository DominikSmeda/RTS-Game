

//USTAWIENIA MATERIALY MODELE ITD MOGŁY BY BYĆ W TYM MIEJSCU EWENTUALNIE MOZNA ZROBIĆ OSOBNE PLIKI JAK Models.js itd.
// var MODELS={}
var SETTINGS = {
    texturesSrc: {
        terrain1: "assets/textures/ground.png"
    },
    materials: {
        terrain1: new THREE.MeshLambertMaterial({
            wireframe: false,
            map: getTexture("assets/textures/ground.png", 120, 120),

        }),
        terrainFar: new THREE.MeshLambertMaterial({
            wireframe: false,
            map: getTexture("assets/textures/ground.png", 1500, 1500),

        }),
        select: new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            wireframe: false,
            transparent: true,
            opacity: 0.5
        }),
        selectedObject: new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide
        }),
        cantSelect: new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: false,
            transparent: true,
            opacity: 0.5
        })
    },
    unitSpeed: 0.01 * 100 /* * 100 - bez ticków! */, //ma być takie samo na serwerze
    gameTickLength: 100,
}

function getTexture(path, repeatX, repeatY) {

    //bez tej funkcji nie da sie tak zrobic :(
    let texture = new THREE.TextureLoader(loadingManager).load(path);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    return texture;
}


