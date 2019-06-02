
class Asset {
    constructor() {

    }
}

class AssetsManager {
    constructor() {

        this.categories = [
            {
                name: 'Bulidings',
                items: [

                ]
            },
            {
                name: 'Characters',
                items: [

                ]
            }

        ]

        this.init();
    }

    init() {
        this.createUI();
    }

    createCategory(name) {
        this.categories.push({ name, items: [] })
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
        this.updateCategories();

    }

    updateCategories() {
        let catNameDiv = $('#assetsManager #categories-names');
        catNameDiv.empty();
        for (let category of this.categories) {
            let categoryDiv = $(`<div class="category-name">${category.name}</div>`);
            catNameDiv.append(categoryDiv)
        }
        catNameDiv.append($('<div style="clear:both">'));

    }

    updateItems(category) {
        let items;
        for (let categ of this.categories) {
            if (categ.name == category) {
                items = categ.items;
                break;
            }
        }

        for (let item of items) {

        }


    }


}
