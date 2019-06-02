
const MODELS_PATH = "assets/models/";

//TUTAJ BEDA WSZYSTKIE MODELE Zeby ZAOSZCZEDZIC MIEJSCE RAM
//BEDZIEMY ROBILI np:  var new_tree1 = MODELS.tree1.mesh.clone() 
var MODELS = {
    tent: {
        type: 'OBJ_MTL',
        obj: MODELS_PATH + 'Tent_Poles_01.obj',
        mtl: MODELS_PATH + 'Tent_Poles_01.mtl',
        mesh: null,
    },
    tree1: {
        type: 'OBJ_MTL',
        obj: MODELS_PATH + 'Tree_01.obj',
        mtl: MODELS_PATH + 'Tree_01.mtl',
        mesh: null
    },
    rock1: {
        type: 'OBJ_MTL',
        obj: MODELS_PATH + 'Rock_1_01.obj',
        mtl: MODELS_PATH + 'Rock_1_01.mtl',
        mesh: null
    },
}


for (let _key in MODELS) {
    if (MODELS[_key].type != 'OBJ_MTL') continue;

    (function (key) {

        var mtlLoader = new THREE.MTLLoader(loadingManager);
        mtlLoader.load(MODELS[key].mtl, (materials) => {
            materials.preload();

            let objLoader = new THREE.OBJLoader(loadingManager);
            objLoader.setMaterials(materials);

            objLoader.load(MODELS[key].obj, (mesh) => {

                mesh.traverse((node) => {
                    if (node instanceof THREE.Mesh) {
                        if ('castShadow' in MODELS[key])
                            node.castShadow = MODELS[key].castShadow;
                        else
                            node.castShadow = true;
                        if ('receiveShadow' in MODELS[key])
                            node.receiveShadow = MODELS[key].receiveShadow;
                        else
                            node.receiveShadow = true;
                    }
                })

                MODELS[key].mesh = mesh;
            })
            // });
        })
    })(_key);
}

