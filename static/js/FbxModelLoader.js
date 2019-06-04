
class FbxModelLoader {
    static getReadyModel(info) {
        return new Promise((resolve, reject) => {
            try {
                const loader = new THREE.FBXLoader(loadingManager);

                loader.load(info.path + '/' + info.mainModel + '.fbx', (object) => {

                    object.mixer = new THREE.AnimationMixer(object);
                    var geometry;
                    let handContainer;

                    object.traverse(function (child) {
                        if (child.isMesh) {

                            child.material
                            child.castShadow = true;
                            child.receiveShadow = false;
                            geometry = child.geometry;

                        }
                    });

                    // let handContainer;//reka postaci
                    // let i = 0;
                    // const tLoader = new THREE.TextureLoader(loadingManager);
                    // tLoader.load(info.texture_path, texture => {
                    // object.traverse(function (child) {
                    //     // console.log(child);

                    //     if (child.isMesh) {


                    //         child.material.map = texture

                    //     }
                    //     //6 kabura
                    //     if (i == info.bone) {
                    //         console.log('s');
                    //         handContainer = new THREE.Object3D()
                    //         child.add(handContainer)

                    //     }

                    //     i++;

                    // });

                    let animations = {};

                    let promises = [];
                    for (let [i, name] of info.animations.entries()) {

                        let p = new Promise((resolve, reject) => {

                            loader.load(`${info.path}/${name}.fbx`, function (anim) {
                                animations[name] = anim.animations[0];
                                resolve()
                            });
                        })

                        promises.push(p);

                    }
                    Promise.all(promises).then(() => {
                        resolve({
                            model: object,
                            animations,
                            handContainer,
                        });
                    })

                    // });

                });
            }
            catch{

            }
        })

    }
}

