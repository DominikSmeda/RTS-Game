//LoadingManager bedzie asystowal loadery i wywoła funkcje
//onLoad po załadowaniu wszystkich assetów

var RESOURCES_LOADED = false;

var loadingManager = new THREE.LoadingManager();

loadingManager.onProgress = (item, loaded, total) => {
    //console.log(item, loaded, total);
    $('#loadingScreen #status #info').html(`
        MODEL:   ${item}<br/><br/>
        LOADED:   ${loaded} / ${total}
    `)
}

loadingManager.onError = function (item) {
    $('#loadingScreen #status #info').html(`
        ERROR WITH LOADING: ${item}
    `)

};

loadingManager.onLoad = () => {
    RESOURCES_LOADED = true;
    // console.log('LOADED');
    try {
        game.resourcesLoaded();
    }
    catch{
        window.location.reload(true);
    }
    $('#loadingScreen').fadeOut();
}


//Użycie:
// var textureLoader = new THREE.TextureLoader(loadingManager);