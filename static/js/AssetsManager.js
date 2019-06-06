
class Item {
    constructor(className) {
        this.className = className;
        this.info = {
            name: name
        }
        this.canvasElement;
        this.canvasSize = {
            width: 100,
            height: 100
        }
        this.init();
    }

    init() {
        let i = new this.className();
        console.log(i);

        this.createItemCanvas();
    }

    createItemCanvas() {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(80, this.canvasSize.width / this.canvasSize.height, 0.1, 10000);

        let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(this.canvasSize.width, this.canvasSize.height);
        renderer.setClearColor(0x000000, 0);
        // renderer.shadowMap.enabled = true
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        camera.position.set(0, 0.1, 3);
        camera.lookAt(scene.position)
        // var axesHelper = new THREE.AxesHelper(1000);
        // scene.add(axesHelper);

        renderer.domElement.classList.add('item');
        this.canvasElement = renderer.domElement;
        let mesh = new this.className();
        mesh.meshInitScale = mesh.assetsManagerInitScale;
        mesh.setMainModel()
        scene.add(mesh);
        scene.add(new THREE.AmbientLight(0xffffff, 0.8))

        renderer.render(scene, camera);

        this.canvasElement.onclick = (e) => {
            game.mainTerrain.startAddObjectFunction(this.className);
        }

    }
}

class AssetsManager {
    constructor() {
        this.categories = []


        this.init();
        this.clicks();
    }

    init() {
        this.createUI();
        this.createCategory('Buildings')
        this.createCategory('Characters')
        this.createCategory('Nature')
        this.addItemToCategory(new Item(Tree), 'Nature');
        this.addItemToCategory(new Item(Rock), 'Nature');
        this.addItemToCategory(new Item(Soldier), 'Characters');
        // jak to zrobić?
        this.addItemToCategory(new Item(Base), 'Buildings');
        this.addItemToCategory(new Item(Palisade), 'Buildings');
        this.addItemToCategory(new Item(Tower), 'Buildings');
        // this.addItemToCategory(new Item('Tree2'), 'Bulidings');

        this.updateItemsView(this.categories[0].name)
    }

    clicks() {
        $('#assetsManager #categories-names').on('click', '.category-name', (e) => {
            this.updateItemsView(e.target.innerText)

        })
    }

    createCategory(name) {
        this.categories.push({ name, items: [] })
        this.updateCategoriesView();
    }

    addItemToCategory(item, category) {
        for (let categ of this.categories) {
            if (categ.name == category) {
                categ.items.push(item);
                break;
            }
        }

    }

    createUI() {
        let mainDiv = $(`<div id="assetsManager">
        <div id="categories-names"></div>
        <div id="categories-items"></div>`);
        $('#hud').append(mainDiv);
        mainDiv.css({ display: 'none' })
        this.updateCategoriesView();

    }

    updateCategoriesView() {
        let catNamesDiv = $('#assetsManager #categories-names');
        catNamesDiv.empty();
        for (let category of this.categories) {
            let categoryDiv = $(`<div class="category-name">${category.name}</div>`);
            catNamesDiv.append(categoryDiv)
        }
        catNamesDiv.append($('<div style="clear:both">'));

    }

    updateItemsView(category) {
        let items;
        for (let categ of this.categories) {
            if (categ.name == category) {
                items = categ.items;
                break;
            }
        }
        let catItemsDiv = $('#assetsManager #categories-items');
        catItemsDiv.empty();

        for (let item of items) {
            catItemsDiv.append(item.canvasElement);
        }


    }


}
