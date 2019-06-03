

//USTAWIENIA MATERIALY MODELE ITD MOGŁY BY BYĆ W TYM MIEJSCU EWENTUALNIE MOZNA ZROBIĆ OSOBNE PLIKI JAK Models.js itd.
// var MODELS={}
var SETTINGS = {
    texturesSrc: {
        terrain1: "assets/textures/terrain1.jpg"
    },
    materials: {
        terrain1: new THREE.MeshPhongMaterial({
            wireframe: false,
            map: getTexture("assets/textures/terrain1.jpg", 50, 50)
        })
    },
    unitSpeed: 0.01 /* * 100 - bez ticków! */, //ma być takie samo na serwerze
}

function getTexture(path, repeatX, repeatY) {

    //bez tej funkcji nie da sie tak zrobic :(
    let texture = new THREE.TextureLoader(loadingManager).load(path);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    return texture;
}


