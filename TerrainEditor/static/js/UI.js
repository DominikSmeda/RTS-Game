
class UI {
    constructor() {

        this.init();
        this.clicks();
    }

    init() {
        $('#ui').append('<input id="lightsHeight" type="range" value="0">');
        $('#ui').append('<input id="lightsIntensity" type="range">');
    }

    clicks() {
        $('#lightsHeight').on('input', (e) => {
            let h = $(e.target).val();
            gameManager.level3D.setLightsHeight(h);
        })

        $('#lightsIntensity').on('input', (e) => {
            let intens = $(e.target).val();
            gameManager.level3D.setLightsIntensity(intens);
        })
    }
}