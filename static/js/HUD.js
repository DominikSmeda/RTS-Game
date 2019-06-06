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
        this.stage = -1;
        this.helpStages = [
            {
                stage: 0,
                header: 'Pomoc',
                description: 'Kliknij poszczególne okienka pomocy, aby je zamknąć.'
            },
            {
                stage: 0,
                header: 'Rozpoczęcie gry',
                description: 'Kliknij na kafelek z bazą, a następnie umieść ją na planszy klikając LPM. <br>Wciśnij Esc, aby zakończyć budowę. <br>Gdy wszyscy gracze postawią swoje bazy, gra się rozpocznie.',
            },
            {
                stage: 0,
                header: 'Poruszanie kamerą',
                description: 'Wciśnięcie ŚPM - poruszanie kamerą,<br>Alt + ŚPM - obrót kamerą,<br>Kółko myszy - przybliżanie / oddalanie widoku.',
            },
            {
                stage: 1,
                header: 'Cel gry',
                description: 'Zniszcz wrogą bazę!',
            },
            {
                stage: 2,
                header: 'Tworzenie jednostek',
                description: 'Wybierz zakładkę "Characters" i postaw żołnierza tak samo jak bazę.<br>Dodatkowo niektóre budynki podczas stawiania możesz obracać wciskając PPM.',
            },
            {
                stage: 2,
                delay: 10000,
                header: 'Pieniądze',
                description: 'Każda jednostka wymaga pieniędzy. Zdobywasz je wraz z upływem czasu.',
            },
            {
                stage: 2,
                delay: 14000,
                header: 'Kierowanie jednostkami',
                description: 'Kliknięcie LPM na własnej jednostce - zaznaczenie jej,<br>Kliknięcie LPM i przeciągnięcie - zaznaczenie jednostek w kwadracie,<br>Shift + zaznaczenie - dodanie do aktualnego zaznaczenia,<br>PPM na mapie - przejście zaznaczonych jednostek w dane miejsce,<br>PPM na wrogu - polecenie ataku,<br>Shift + PPM na mapie - przejście zaznaczonych jednostek w dane miejsce i atakowanie napotkanych wrogów.',
            },
            {
                stage: 2,
                delay: 20000,
                header: 'AI',
                description: 'Gdy jednostki nic nie robią, to same będą atakować wrogów w pobliżu.',
            },
            {
                stage: 3,
                header: 'Koniec gry',
                description: 'Oto Twoje statystyki. Aby je zapisać, wpisz swój nick.',
            },
        ]
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
        this.helpDiv = $('<div class="help">');
        this.helpTilesContainer = $('<div class="container">');
        this.helpDiv.html('<h3 style="text-align:center;">Pomoc</h3>');
        this.helpDiv.append(this.helpTilesContainer);
        this.mainDiv.append(this.helpDiv);
    }
    helpNextStage() {
        this.stage++;
        for (let i = 0; i < this.helpStages.length; i++) {
            const el = this.helpStages[i];
            if (el.stage != this.stage) continue;
            if (el.delay) setTimeout(this.addHelpTile.bind(this, el), el.delay);
            else this.addHelpTile(el);
        }
    }
    addHelpTile(element) {
        let tile = $('<div class="tile">');
        var header = $('<h4 class="header">').html(element.header);
        var description = $('<p class="description">').html(element.description);
        tile.append(header).append(description);
        tile.click(() => {
            tile.remove();
            if (this.helpTilesContainer.children('.tile').length < 1)
                this.helpDiv.css('display', 'none');
        });
        this.helpDiv.css('display', 'block');
        this.helpTilesContainer.append(tile);
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