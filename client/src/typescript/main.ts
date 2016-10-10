import SpriteBatch = Phaser.SpriteBatch;
import Sprite = Phaser.Sprite;

class SimpleGame {

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', {
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

class Starfield {
    constructor() {
        this.game = new Phaser.Game(window.innerWidth, 600, Phaser.AUTO, 'content', {
            preload: () => this.preload(),
            create: () => this.create(),
            update: () => this.update()
        });

        this.del = this.tab[this.tabb + 4];
        this.delx = this.tab[this.tabb + 3];
    }

    game: Phaser.Game;
    sprites: SpriteBatch;

    max: number = 164;

    //  Path data table
    tab: Array<number> = [ 0, 0, -4, 25, 250, 2, 1, -4, 25, 100, 3, 1, -2, 25, 100, 4, 2, 2, 25, 100, -4, 2, 2, 10, 100, 0, 0, -2, 25, 250, 0, 2, 0, 25, 200, 0, 2, 2, 25, 100, 0, 0, 2, 25, 100, 2, 0, 2, 25, 200, 0, 2, 2, 25, 200, 2, 0, 2, 25, 200, 0, 4, 2, 25, 200 ];
    tabb: number = 0;
    del: number;
    delx: number;

    speedx: number = 0;
    speedy: number = 0;
    speedz: number = 0;

    speedx2: number = 0;
    speedy2: number = 0;
    speedz2: number = 0;

    xx: number[] = [];
    yy: number[] = [];
    zz: number[] = [];

    balls: Sprite[] = [];

    preload() {
        this.game.load.image('star', 'images/star.png');
    }

    create() {
        this.sprites = this.game.add.spriteBatch(this.game.world);

        if (this.game.renderType == Phaser.WEBGL) {
            this.max = 2000;
        }

        for (var i = 0; i < this.max; i++)
        {
            this.xx[i] = Math.floor(Math.random() * 1600) - 800;
            this.yy[i] = Math.floor(Math.random() * 1200) - 600;
            this.zz[i] = Math.floor(Math.random() * 1600) - 800;

            let star = this.game.make.sprite(0, 0, 'star');
            star.anchor.set(0.5);

            this.sprites.addChild(star);

            this.balls.push(star);
        }

        this.speedx = this.tab[this.tabb + 0];
        this.speedy = this.tab[this.tabb + 1];
        this.speedz = this.tab[this.tabb + 2];

    }

    update() {
        var ppDist = 800;

        this.delx--;

        if (this.delx === 0)
        {
            if (this.speedz > this.speedz2)
            {
                this.speedz2++;
            }

            if (this.speedz < this.speedz2)
            {
                this.speedz2--;
            }

            if (this.speedx > this.speedx2)
            {
                this.speedx2++;
            }

            if (this.speedx < this.speedx2)
            {
                this.speedx2--;
            }

            if (this.speedy > this.speedy2)
            {
                this.speedy2++;
            }

            if (this.speedy < this.speedy2)
            {
                this.speedy2--;
            }

            this.delx = this.tab[this.tabb + 3];
        }

        this.del--;

        if (this.del === 0)
        {
            this.tabb += 5;

            if (this.tabb >= this.tab.length)
            {
                this.tabb = 0;
            }

            this.speedx = this.tab[this.tabb + 0];
            this.speedy = this.tab[this.tabb + 1];
            this.speedz = this.tab[this.tabb + 2];

            this.del = this.tab[this.tabb + 4];
        }

        for (var i = 0; i < this.max; i++)
        {
            var perspective = ppDist / (ppDist - this.zz[i]);

            this.balls[i].x = 400 + this.xx[i] * perspective;
            this.balls[i].y = 300 + this.yy[i] * perspective;
            this.balls[i].alpha = Math.min(perspective / 2, 1);
            this.balls[i].scale.set(perspective / 2);

            this.xx[i] += this.speedx2;

            if (this.xx[i] < -800)
            {
                this.xx[i] = this.xx[i] + 1600;
            }

            if (this.xx[i] >= 800)
            {
                this.xx[i] = this.xx[i] - 1600;
            }

            this.yy[i] += this.speedy2;

            if (this.yy[i] < -600)
            {
                this.yy[i] = this.yy[i] + 1200;
            }

            if (this.yy[i] >= 600)
            {
                this.yy[i] = this.yy[i] - 1200;
            }

            this.zz[i] -= this.speedz2;

            if (this.zz[i] < -800)
            {
                this.zz[i] += 1600;
            }

            if (this.zz[i] > 800)
            {
                this.zz[i] -= 1600;
            }

        }
    }

}

window.onload = () => {
    var game = new Starfield();
};