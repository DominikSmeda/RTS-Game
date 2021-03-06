
class Item {
    constructor(className, amount = -1) {
        this.className = className;
        this.info = {
            name: name
        }
        this.canvasElement;
        this.domElement;
        this.canvasSize = {
            width: 100,
            height: 100
        }
        this.amount = amount;
        this.amountDiv;
        this.init();
    }

    init() {

        this.domElement = $('<div class="item-container">');
        this.createDomElement();

    }

    createDomElement() {
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(80, this.canvasSize.width / this.canvasSize.height, 0.1, 10000);

        let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(this.canvasSize.width, this.canvasSize.height);
        renderer.setClearColor(0x000000, 0);
        // renderer.shadowMap.enabled = true
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        camera.position.set(0, 0.2, 3);
        let spos = scene.position.clone();
        spos.y += 0.6
        camera.lookAt(spos)
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


        let amountDiv = $('<div class="amount">');
        amountDiv.html(this.amount == -1 ? '&infin;' : this.amount);
        this.amountDiv = amountDiv;

        this.canvasElement.onclick = (e) => {
            game.mainTerrain.startAddObjectFunction(this.className, this);
        }
        this.domElement.append(this.canvasElement)

        let infoDiv = $('<div class="information">')
        for (let [key, value] of Object.entries(mesh.assetsManagerData)) {
            infoDiv.html(infoDiv.html() + `<b>${key}</b>: ${value}<br/>`)
        }
        this.domElement.append(infoDiv);

        // amountDiv.text('asdddddddddddd')
        this.domElement.append(amountDiv);

        let goldDiv = $('<div class="gold">')
        goldDiv.text(mesh.cost + 'g')
        this.domElement.append(goldDiv)

        let nameDiv = $('<div class="name">')
        nameDiv.text(mesh.name)
        this.domElement.append(nameDiv)


    }

    buy() {

        if (this.amount > 0) {
            this.amount--;
            this.amountDiv.html(this.amount)
        }
        if (this.amount == 0) {

            this.domElement.css({ background: '#ff0000' })
            return;
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
        this.addItemToCategory(new Item(Base, 1), 'Buildings');

        // this.addItemToCategory(new Item('Tree2'), 'Bulidings');

        this.updateItemsView(this.categories[0].name)
    }

    onGameStart() {
        this.addItemToCategory(new Item(Tree, 50), 'Nature');
        this.addItemToCategory(new Item(Rock, 41), 'Nature');
        this.addItemToCategory(new Item(Soldier), 'Characters');
        // jak to zrobi???

        this.addItemToCategory(new Item(Palisade), 'Buildings');
        this.addItemToCategory(new Item(Tower, 3), 'Buildings');
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
            catItemsDiv.append(item.domElement);
        }


    }


}
