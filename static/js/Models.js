
const MODELS_PATH = "assets/models/";

//TUTAJ BEDA WSZYSTKIE MODELE Zeby ZAOSZCZEDZIC MIEJSCE RAM
//BEDZIEMY ROBILI np:  var new_tree1 = MODELS.tree1.mesh.clone() 

//mesh tak naprawde czasem oznacza grupe ale juz tego nie bede zmienial
//meshAnimations : animacje po załadowaniu.
var MODELS = {
    tent: {
        type: 'OBJ_MTL',
        obj: MODELS_PATH + 'Tent_Poles_01.obj',
        mtl: MODELS_PATH + 'Tent_Poles_01.mtl',
        mesh: null,
    },
    tree1: {
        type: 'FBX',
        mainModel: 'Bush_03',
        path: MODELS_PATH,
        animations: [],
        mesh: null,
        meshAnimations: null
    },
    rock1: {
        type: 'FBX',
        mainModel: 'Rock_04',
        path: MODELS_PATH,
        animations: [],
        mesh: null,
        meshAnimations: null
    },
    treeJSON: {
        type: 'json',
        json: MODELS_PATH + 'Tent_Poles_01.json',
        mesh: null
    },//Characters
    Soldier1: {
        type: 'FBX',
        path: MODELS_PATH + 'characters/' + 'Soldier1', //<- !bez / 
        mainModel: 'Soldier1',//model ma domyslna animacje stania w miejscu
        animations: ['Soldier1', 'Attack1', 'Attack2', 'Running', 'Guarding', 'Dying'],
        mesh: null,
        meshAnimations: null
    }
}

// Owinięto w document ready, gdyż czasem wyrzucało błąd 
// "Uncaught ReferenceError: game is not defined" (w loadingManager.js) 
// lub podobny
//EDIT: naprawiłem bład i juz nie potrzeba tej funkcji


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

                MODELS[key].mesh = mesh.children[0];// <- mam nadzieje ze medzie dzialac dla innych modeli
                //dzieki temu nie dostajemy grupy tylko mesha   w razie BŁEDU zmienic na:  = mesh;

            })
            // });
        })
    })(_key);
}




for (let _key in MODELS) {
    if (MODELS[_key].type != 'json') continue;

    (function (key) {

        // let loader = new THREE.ObjectLoader(loadingManager);

        // loader.load(MODELS[key].json,
        //     (obj) => {
        //         console.log(obj);
        //         let m = new THREE.Mesh(obj)
        //         console.log(m);

        //         MODELS[key].mesh = obj;
        //         // game.scene.add(obj)

        //     },
        //     (xhr) => {
        //         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        //     },
        //     (err) => {
        //         console.error('An error happened', err);
        //     });

        // let loader = new THREE.JSONLoader(loadingManager);

        // loader.load(MODELS[key].json, (geometry) => {
        //     let mesh = new THREE.Mesh(geometry);
        //     // game.scene.add(mesh)
        //     MODELS[key].mesh = mesh;
        //     console.log(mesh);

        // })
        var loader = new THREE.ObjectLoader(loadingManager);
        loader.load(MODELS[key].json, (object) => {
            var geometry;
            object.traverse((node) => {
                if (node.isMesh) geometry = node.geometry;
            });
            // game.scene.add(mesh)
            let mesh = new THREE.Mesh(geometry);
            MODELS[key].mesh = mesh;
            // console.log(mesh);

        });

    })(_key);
}

for (let _key in MODELS) {
    if (MODELS[_key].type != 'FBX') continue;
    (function (key) {
        let modelData = MODELS[key];
        let info = {
            mainModel: modelData.mainModel,
            animations: modelData.animations,
            path: modelData.path
        };

        FbxModelLoader.getReadyModel(info)
            .then(({ model, animations, handContainer }) => {
                model.scale.set(0.03, 0.03, 0.03)
                MODELS[key].mesh = model;
                MODELS[key].meshAnimations = animations;
            })

    })(_key);
}
