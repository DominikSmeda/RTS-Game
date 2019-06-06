
const MODELS_PATH = "assets/models/";

//TUTAJ BEDA WSZYSTKIE MODELE Zeby ZAOSZCZEDZIC MIEJSCE RAM
//BEDZIEMY ROBILI np:  var new_tree1 = MODELS.tree1.mesh.clone() 

//mesh tak naprawde czasem oznacza grupe ale juz tego nie bede zmienial
//meshAnimations : animacje po załadowaniu.
var MODELS = {
    tree1: {
        type: 'fbx',
        modelSrc: 'Bush_03',
        path: MODELS_PATH,
        model: null,

    },
    rock1: {
        type: 'fbx',
        modelSrc: 'Rock_04',
        path: MODELS_PATH,
        model: null,

    },
    //Characters
    //Ponizej wzorowy model kazdego modelu fbx
    Soldier1: {
        type: 'fbx',
        skinned: true,
        path: MODELS_PATH + 'characters/' + 'Soldier1/',
        modelSrc: 'Soldier1',
        animationsSrc: ['Walking', 'Attack1', 'Soldier1', 'Dying'],
        model: null,
        animations: null,
        rawMesh: null
    },
    castle: {
        type: 'fbx',
        path: MODELS_PATH + 'buildings/' + 'Castle/',
        modelSrc: 'Castle_Part_10',
        model: null
    },
    palisade: {
        type: 'fbx',
        path: MODELS_PATH + 'buildings/' + 'Palisade/',
        modelSrc: 'Wood_Wall_03',
        model: null
    },
    tower: {
        type: 'fbx',
        path: MODELS_PATH + 'buildings/' + 'Tower/',
        modelSrc: 'Castle_Part_08',
        model: null
    }
}

//FBX---------------------------------------

for (let model in MODELS) {
    if (MODELS[model].type == "fbx") {
        createModelByData(model);
    }
}

function createModelByData(modelName) {

    let model = MODELS[modelName];
    const loader = new THREE.FBXLoader(loadingManager);

    loader.load(model.path + model.modelSrc + '.fbx', (object) => {

        model.model = object;
        object.traverse((child) => {

            if (child.isSkinnedMesh) {
                model.rawMesh = child;

            }
            if (child.isMesh) {
                child.castShadow = true;
            }
        })
    })

    if (model.animationsSrc) {
        model.animations = {}
        for (let name of model.animationsSrc) {
            ((animationName) => {
                const loader = new THREE.FBXLoader(loadingManager);

                loader.load(model.path + animationName + '.fbx', (animationGroup) => {
                    model.animations[animationName] = animationGroup.animations[0];

                })
            })(name);
        }

    }

}




















// Owinięto w document ready, gdyż czasem wyrzucało błąd 
// "Uncaught ReferenceError: game is not defined" (w loadingManager.js) 
// lub podobny
//EDIT: naprawiłem bład i juz nie potrzeba tej funkcji

//MTL  NARAZIE NIE UZYWAMY
// for (let _key in MODELS) {
//     if (MODELS[_key].type != 'OBJ_MTL') continue;
//     (function (key) {
//         var mtlLoader = new THREE.MTLLoader(loadingManager);
//         mtlLoader.load(MODELS[key].mtl, (materials) => {
//             materials.preload();

//             let objLoader = new THREE.OBJLoader(loadingManager);
//             objLoader.setMaterials(materials);

//             objLoader.load(MODELS[key].obj, (mesh) => {

//                 mesh.traverse((node) => {
//                     if (node instanceof THREE.Mesh) {
//                         if ('castShadow' in MODELS[key])
//                             node.castShadow = MODELS[key].castShadow;
//                         else
//                             node.castShadow = true;
//                         if ('receiveShadow' in MODELS[key])
//                             node.receiveShadow = MODELS[key].receiveShadow;
//                         else
//                             node.receiveShadow = true;
//                     }
//                 })

//                 MODELS[key].mesh = mesh.children[0];// <- mam nadzieje ze medzie dzialac dla innych modeli
//                 //dzieki temu nie dostajemy grupy tylko mesha   w razie BŁEDU zmienic na:  = mesh;

//             })
//             // });
//         })
//     })(_key);
// }


//JSON na razie nie uzywamy

// for (let _key in MODELS) {
//     if (MODELS[_key].type != 'json') continue;

//     (function (key) {

//         // let loader = new THREE.ObjectLoader(loadingManager);

//         // loader.load(MODELS[key].json,
//         //     (obj) => {
//         //         console.log(obj);
//         //         let m = new THREE.Mesh(obj)
//         //         console.log(m);

//         //         MODELS[key].mesh = obj;
//         //         // game.scene.add(obj)

//         //     },
//         //     (xhr) => {
//         //         console.log((xhr.loaded / xhr.total * 100) + '% loaded');
//         //     },
//         //     (err) => {
//         //         console.error('An error happened', err);
//         //     });

//         // let loader = new THREE.JSONLoader(loadingManager);

//         // loader.load(MODELS[key].json, (geometry) => {
//         //     let mesh = new THREE.Mesh(geometry);
//         //     // game.scene.add(mesh)
//         //     MODELS[key].mesh = mesh;
//         //     console.log(mesh);

//         // })
//         var loader = new THREE.ObjectLoader(loadingManager);
//         loader.load(MODELS[key].json, (object) => {
//             var geometry;
//             object.traverse((node) => {
//                 if (node.isMesh) geometry = node.geometry;
//             });
//             // game.scene.add(mesh)
//             let mesh = new THREE.Mesh(geometry);
//             MODELS[key].mesh = mesh;
//             // console.log(mesh);

//         });

//     })(_key);
// }


