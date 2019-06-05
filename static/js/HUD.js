class HUD {
    constructor(parent) {
        this.parent = parent;
        this.createHUD();
    }
    get DOMElement() {
        return this.jQueryElement[0];
    }
    get jQueryElement() {
        return this.mainDiv;
    }

    updateGold() {
        this.goldElement.text('Gold: ' + Math.floor(this.parent.gold));
    }

    createHUD() {
        this.mainDiv = $('<div class="hud">');

        var selectDiv = $('<div class="select">'); // lewy dolny róg, okno z zaznaczonymi postaciami
        var shopDiv = $('<div class="shop">'); // prawy dolny róg, okno z postaciami do stworzenia + złoto
        var infoDiv = $('<div class="info">'); // prawy górny róg, okno z różnymi informacjami

        this.mainDiv.append(selectDiv)
            .append(shopDiv)
            .append(infoDiv);

        // SELECT DIV
        // jeszcze nie obsługiwany

        // SHOP DIV
        this.shopContainer = $('<div class="container">');
        shopDiv.append(this.shopContainer);
        for (let i = 0; i < this.parent.shop.length; i++) {
            let el = this.parent.shop[i];
            let tile = el.getShopjQueryElement();
            tile.click(() => { el.buy() })
            this.shopContainer.append(tile);

        }
        this.shopContainer.css({ width: 'calc(' + this.parent.shop.length + ' * var(--hud-shopHeight) + 2 * var(--hud-shopPadding))' })
        this.goldElement = $('<div class="gold">');
        shopDiv.append(this.goldElement);

        // INFO DIV
        // jeszcze nie obsługiwany
    }
}