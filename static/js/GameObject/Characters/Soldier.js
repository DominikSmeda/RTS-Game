
class Soldier extends Character {
    constructor() {
        let modelName = "Soldier1"
        super(modelName);

        this.net.speed = 25;
        this.net.damage = 10;
        this.name = "Wojownik";

        this.meshInitScale = 0.005;
        this.assetsManagerInitScale = 0.01;

        //walka
        //wszelkie czasy podano w sekundach
        this.net.speed = 3;
        this.net.range = 2; // zasięg ataku
        this.net.damage = 5; // obrażenia
        this.net.attackCooldown = 1;//czas przygotowania przed następnym atakiem
        this.net.attackAnimLength = 0.7;//długość stania w miejscu w czasie wykonywania ataku (by skończyć animację)
        this.HP = 50;
        this.net.sightRange = 20;//zasięg widzenia - jeśli przeciwnik jest bliżej, a jednostka nic nie robi, to zacznie go ścigać
        this.assetsManagerData = {//inne dane w assets Managerze
            szybkosc: 10,
            obrazenia: 20
        }

        this.netActions = {
            walk: 'Walking',
            attack: 'Attack1',
            idle: 'Soldier1',
            die: 'Dying',
        }


    }

    onDeathTimer() {
        // wykonuje się tuż po onDeath
        setTimeout(this.onDeathEnd.bind(this), 4000)
    }
}