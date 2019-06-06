class GameObject extends WorldObject {
    // Ta klasa zbiera wszystkie klasy będące bezpośrednio 
    // elementami rozgrywki (budynki, jednostki)
    constructor(modelName = null) {
        super(modelName);

        this.net.owner = game.playerID;
        this.net.color = game.playerColor;

        this.moving = 0;

        //walka
        //wszelkie czasy podano w sekundach
        this.net.attackDest = null; //cel ataku (net.id)
        this.net.canBeDamaged = true; //czy może być zaatakowany (nie zaimplementowano)
        this.net.range = 10; // zasięg ataku
        this.net.damage = 1; // obrażenia
        this.net.attackCooldown = 1;//czas przygotowania przed następnym atakiem
        this.net.attackCooldownCounter = 1;//aktualny pozostały czas przygotowania przeliczany przez serwer
        this.net.attackAnimLength = 0.7;//długość stania w miejscu w czasie wykonywania ataku (by skończyć animację)
        this.net.attackAnimTime = 0;//aktualny pozostały czas stania w miejscu przeliczany przez serwer
        //hp jest w klasie wyżej
        this.net.sightRange = 50;//zasięg widzenia - jeśli przeciwnik jest bliżej, a jednostka nic nie robi, to zacznie go ścigać
        this.net.closeEnough = false;

        this.net.action = null;


        this.mixer;
        this.actions = {};//wszystkie akcje postaci
        this.currentAction;
        //!ABY zmienic animacje this.action = NAZWA_ANIMACJI np. 'Walking' 
        this.netActions = {
            walk: null,
            attack: null,
            idle: null,
            die: null,
        }
        this.netCurrentAction = null;

        this.imgSrc = "assets/thumbnails/default.jpg"; //Źródło pliku obrazu, który będzie wyświetlany jako miniaturka
        this.shopjQuery = null;
    }

    onDataUpdate() {
        super.onDataUpdate();
        //console.log(Math.random() * 4 % 4);
        if (Math.random() * 4 % 4 < 1 && this.moving < 0.1 && !this.net.attackDest && !this.net.attackMove)
            this.findEnemyInRange();
        if (this.net.action != this.netCurrentAction) {
            //console.log(this.mainModel)
            this.netCurrentAction = this.net.action;
            if (this.netActions[this.net.action]) this.action = this.netActions[this.net.action];
        }
        if (this.net.destinationType == 'buildings') {
            for (let i = 0; i < game.objects.buildings.length; i++) {
                const bu = game.objects.buildings[i];
                if (bu.net.id == this.net.destinationID) {
                    // tutaj możesz zrobić raycasta do budynku
                    // bu - obiekt klasy Building
                    this.edited = true;
                    if (Math.sqrt(
                        Math.pow(bu.net.position[0] - this.net.position[0], 2) +
                        Math.pow(bu.net.position[1] - this.net.position[1], 2)
                    ) < bu.net.size) {
                        this.net.closeEnough = true;
                    } else {
                        this.net.closeEnough = false;
                    }
                }
            }
        }
        /* this.mainModel.rotation.set(

        ); */
    }

    //Po pierwszym zabójstwie zacina się - trzeba zresetować net.attackDest
    findEnemyInRange() {
        if (!this.mine) return;
        var toSearch = ['characters', 'buildings'];
        for (var x = 0; x < toSearch.length; x++) {
            for (let i = 0; i < game.objects[toSearch[x]].length; i++) {
                const el = game.objects[toSearch[x]][i];
                if (el.mine || el.dead) continue;
                if (Math.sqrt(Math.pow(this.net.position[0] - el.net.position[0], 2) + Math.pow(this.net.position[1] - el.net.position[1], 2)) < this.net.sightRange) {
                    this.edited = true;
                    this.net.attackDest = el.net.id;
                    this.net.destination = el.net.position;
                    this.net.destinationID = el.net.id;
                    this.net.destinationType = el.net.type;
                    this.net.attackMove = false;
                }
            }
        }
    }

    //kupienie jednostki
    buy() {
        if (game.gold > this.cost) {
            game.gold -= this.cost;
            game.net.update({
                id: game.playerID,
                type: 'gold',
                cost: this.cost,
                className: this.className,
            })
            // var obj = eval('new ' + this.net.className + '()');
            // obj.net.position = game.base ? game.base.spawnPosition : [0, 0];
            // game.createObject(this);
            return true;
        }
        return false;
    }

    onRender(delta) {
        super.onRender(delta);

        if (this.mixer) this.mixer.update(delta);
    }


    //Cześc odpowiedzialna za animacje

    set action(actionName) {
        this.currentAction = this.actions[actionName];
        if (!this.currentAction) return;
        this.mixer.stopAllAction();

        this.currentAction.time = 0;


        this.currentAction.fadeIn(0.5);
        this.currentAction.play();
        //console.log(this.actions)
    }

    get action() {
        return this.currentAction;
    }

    createActions() {
        if (!MODELS[this.modelName].skinned) return;
        // console.log('s');
        this.mixer = new THREE.AnimationMixer(this.mainModel);
        for (let animationName of MODELS[this.modelName].animationsSrc) {

            this.actions[animationName] = this.mixer.clipAction(MODELS[this.modelName].animations[animationName])
        }


        this.action = "Walking"
    }

    onModelLoaded() {
        this.createActions();

    }
    //..........
    getShopjQueryElement() {
        if (this.shopjQuery) return this.shopjQuery;
        var mainDiv = this.shopjQuery = $('<div class="tile">');

        var name = $('<div class="name">');
        name.text(this.name);
        var img = $('<img src="' + this.imgSrc + '">');
        var cost = $('<div class="cost">');
        cost.text(this.cost + 'g');

        mainDiv.append(img)
            .append(name)
            .append(cost);
        return mainDiv;
    }
}