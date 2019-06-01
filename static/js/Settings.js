

//USTAWIENIA MATERIALY MODELE ITD MOGŁY BY BYĆ W TYM MIEJSCU EWENTUALNIE MOZNA ZROBIĆ OSOBNE PLIKI JAK Models.js itd.
// var MODELS={}
var SETTINGS = {
    texturesSrc: {
        terrain1: "texture.jpg"
    },
    materials: {
        terrain1: new THREE.MeshPhongMaterial({
            wireframe: false,
            map: getTexture("texture.jpg", 50, 50)
        })
    }
}
console.log(SETTINGS.texturesSrc.terrain1);
function getTexture(path, repeatX, repeatY) {

    //bez tej funkcji nie da sie tak zrobic :(
    let texture = new THREE.TextureLoader().load(path);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    return texture;
}


