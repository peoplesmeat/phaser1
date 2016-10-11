class SimpleGame {

    constructor() {
        this.game = new Phaser.Game(window.innerWidth, 600, Phaser.AUTO, 'content', {
            preload: () => this.preload(),
            create: () => this.create()
        });
    }

    game: Phaser.Game;

    preload() {
        this.game.load.image('logo', 'images/phaser2.png');
    }

    addLogo() {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');

        logo.anchor.setTo(0.5, 0.5);
        logo.scale.setTo(0.2, 0.2);

        this.game.add.tween(logo.scale).to({ x: 2, y: 1 }, 500, Phaser.Easing.Bounce.Out, true);
    }

    create() {
        this.addLogo();
    }

}