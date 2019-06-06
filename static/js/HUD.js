class HUD {
    constructor(parent) {
        this.parent = parent;
        this.statNames = {
            unitsKilled: "Zabite jednostki", // 'className':0, _total:0
            unitsBought: "Kupione jednostki",
            _total: "Wszystkie", // 'className':0, _total:0
            moneySpent: "Wydane złoto", // wydana kasa
            moneySaved: "Zachowane złoto", // oszczędzona kasa pod koniec gry
            moneyGained: "Zdobyte złoto", // zdobyta kasa łącznie
            duration: "Czas gry", // czas gry
            won: "Wygrał", //czy wygrał
            name: "Nick", //nick
        }
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

        // var selectDiv = $('<div class="select">'); // lewy dolny róg, okno z zaznaczonymi postaciami
        // var shopDiv = $('<div class="shop">'); // prawy dolny róg, okno z postaciami do stworzenia + złoto
        // var infoDiv = $('<div class="info">'); // prawy górny róg, okno z różnymi informacjami
        // var helpDiv = $('<div class="help">'); // lewy górny róg, okno z pomocą

        // this.mainDiv.append(selectDiv)
        //     .append(shopDiv)
        //     .append(infoDiv)
        //     .append(helpDiv);

        // SELECT DIV
        // jeszcze nie obsługiwany

        // SHOP DIV
        /*this.shopContainer = $('<div class="container">');
        /*shopDiv.append(this.shopContainer);
        for (let i = 0; i < this.parent.shop.length; i++) {
            let el = this.parent.shop[i];
            let tile = el.getShopjQueryElement();
            tile.click(() => { el.buy() })
            this.shopContainer.append(tile);

        }
        this.shopContainer.css({ width: 'calc(' + this.parent.shop.length + ' * var(--hud-shopHeight) + 2 * var(--hud-shopPadding))' })
         */
        this.goldElement = $('<div class="gold">');
        // shopDiv.append(this.goldElement);
        this.mainDiv.append(this.goldElement);

        // INFO DIV
        // jeszcze nie obsługiwany

        // HELP DIV

    }
    addHelpTile() {

    }


    showStatistics(data, clear = true) {
        if (this.stats && clear) {
            this.stats.remove();
            this.stats = $('<div class="stats">');
        }
        else if (!this.stats) this.stats = $('<div class="stats">');
        var div = this.stats;
        if (this.tab) $(this.tab).remove();
        var tab = this.tab = $('<table class="tab">')[0];
        if (data.info || data.error) {
            tab.innerHTML += '<tr><td colspan="2">' + (data.info ? data.info : '<b>Błąd bazy danych</b>') + '</td></tr>';
        }
        else {
            if (data.name) {
                tab.innerHTML += this.getTR(this.statNames.name, data.name);
            }
            for (let i = 0; i < Object.keys(data).length; i++) {
                const k = Object.keys(data)[i];
                if (k == '_id') continue;
                if (typeof data[k] == 'object') {
                    tab.innerHTML += this.getTR(this.statNames[k], '');
                    for (let j = 0; j < Object.keys(data[k]).length; j++) {
                        const key = Object.keys(data[k])[j];
                        if (key == '_total') continue;
                        try {
                            var obj = eval('new ' + key + '()');
                            tab.innerHTML += this.getTR(obj.name, data[k][key], true);
                        } catch (e) {
                            tab.innerHTML += this.getTR(key, data[k][key], true);
                        }
                    }
                }
                else {
                    if (k == 'name') continue;
                    if (k == 'won') tab.innerHTML += this.getTR(this.statNames[k], data[k] ? "tak" : "nie");
                    else tab.innerHTML += this.getTR(this.statNames[k], data[k]);
                }
            }
        }
        div.append($(tab));
        $('#overlay').append(div);
    }
    getTR(key, value, indent = false) {
        return "<tr><td>" + (indent ? '<i><div style="width:10px;"></div>' : '<b>') + key +
            (indent ? "</i>" : "</b>") + "</td><td>" + value + "</td></tr>";
    }
    showAllStatistics(data) {
        if (data.error || data.length == 0) {
            if (data.error) data.info = '<b>Błąd bazy danych</b>';
            else data.info = '<i>Brak rekordów</i>'
            this.showStatistics(data);
            return;
        }
        data = data.reverse();

        var ind = 0;
        console.log(data)
        this.allStats = data;
        if (this.stats) {
            this.stats.remove();
        }
        this.stats = $('<div class="stats">');

        var butPrev = $('<button>').text('<<').click(() => {
            if (--ind > 0) butPrev.attr('disabled', null);
            else butPrev.attr('disabled', 'yes');
            if (ind < data.length - 1) butNext.attr('disabled', null);
            else butNext.attr('disabled', 'yes');
            this.showStatistics(data[ind], false);
        });
        var butNext = $('<button>').text('>>').click(() => {
            if (++ind > 0) butPrev.attr('disabled', null);
            else butPrev.attr('disabled', 'yes');
            if (ind < data.length - 1) butNext.attr('disabled', null);
            else butNext.attr('disabled', 'yes');
            this.showStatistics(data[ind], false);
        });
        if (ind > 0) butPrev.attr('disabled', null);
        else butPrev.attr('disabled', 'yes');
        if (ind < data.length - 1) butNext.attr('disabled', null);
        else butNext.attr('disabled', 'yes');

        this.stats.append(butPrev).append(butNext);
        this.showStatistics(data[0], false);
    }
}