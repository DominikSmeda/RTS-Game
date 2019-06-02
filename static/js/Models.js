
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
    treeJSON: {
        type: 'json',
        json: MODELS_PATH + 'King.json',
        mesh: null
    }
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

for (let _key in MODELS) {
    if (MODELS[_key].type != 'json') continue;

    (function (key) {

        // let loader = new THREE.ObjectLoader();

        // loader.load(MODELS[key].json,
        //     (obj) => {
        //         MODELS[key].mesh = obj;
        //         console.log(obj);
        //         game.scene.add(obj)

        //     },
        //     (xhr) => {
        //         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        //     },
        //     (err) => {
        //         console.error('An error happened', err);
        //     });

        let loader = new THREE.JSONLoader(loadingManager);

        loader.load(MODELS[key].json, (geometry) => {
            let mesh = new THREE.Mesh(geometry);
            // game.scene.add(mesh)
            MODELS[key].mesh = mesh;
            console.log(mesh);

        })
    })(_key);
}