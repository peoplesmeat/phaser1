import SpriteBatch = Phaser.SpriteBatch;
import Sprite = Phaser.Sprite;

class PathComponent {
    dx: number;
    dy: number;
    dz: number;
    delx: number;
    del: number;

    constructor(dx: number, dy: number, dz: number, delx: number, del: number) {
        this.dx = dx;
        this.dy = dy;
        this.dz = dz;
        this.delx = delx;
        this.del = del;
    }
}

class Starfield {
    constructor() {
        this.width = window.innerWidth;

        this.game = new Phaser.Game(this.width, 600, Phaser.AUTO, 'content', {
            preload: () => this.preload(),
            create: () => this.create(),
            update: () => this.update()
        });

        this.del = this.tab[this.tabb + 4];
        this.delx = this.tab[this.tabb + 3];

        for (var i=0; i<this.tab.length/5; i++) {
            this.path.push(new PathComponent(this.tab[i*5+0], this.tab[i*5+1], this.tab[i*5+2], this.tab[i*5+3] ,this.tab[i*5+4]));
        }
        console.log(this.path);
    }

    width: number;

    game: Phaser.Game;
    sprites: SpriteBatch;

    max: number = 164;

    //  Path data table
    // (speedx, speedy, speedz, number of frames to accelerate, number of frames to live in path
    // (speedx, speedy, speedz, delx, del
    tab: Array<number> = [0, 0, -4, 25, 100, 2, 1, -4, 25, 100, 3, 1, -2, 25, 100, 4, 2, 2, 25, 100, -4, 2, 2, 10, 100, 0, 0, -2, 25, 250, 0, 2, 0, 25, 200, 0, 2, 2, 25, 100, 0, 0, 2, 25, 100, 2, 0, 2, 25, 200, 0, 2, 2, 25, 200, 2, 0, 2, 25, 200, 0, 4, 2, 25, 200];
    path: Array<PathComponent> = [];
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
        this.game.load.image('star2', 'images/star2.png');
        this.game.load.image('star3', 'images/star3.png');
    }

    create() {
        this.sprites = this.game.add.spriteBatch(this.game.world);

        if (this.game.renderType == Phaser.WEBGL) {
            this.max = 2000;
        }

        for (var i = 0; i < this.max; i++) {
            this.xx[i] = Math.floor(Math.random() * (this.width * 2)) - this.width;
            this.yy[i] = Math.floor(Math.random() * 1200) - 600;
            this.zz[i] = Math.floor(Math.random() * (this.width * 2)) - this.width;

            let r = Math.random();
            let starname = 'star';
            if (r < 0.33) {
                starname = 'star2';
            } else if (r < 0.66) {
                starname = 'star3';
            }
            let star = this.game.make.sprite(0, 0, starname);
            star.anchor.set(0.5);

            this.sprites.addChild(star);

            this.balls.push(star);
        }

        this.speedx = this.tab[this.tabb + 0];
        this.speedy = this.tab[this.tabb + 1];
        this.speedz = this.tab[this.tabb + 2];

    }

    update() {
        var ppDist = this.width;

        this.delx--;

        if (this.delx === 0) {
            if (this.speedz > this.speedz2) {
                this.speedz2++;
            }

            if (this.speedz < this.speedz2) {
                this.speedz2--;
            }

            if (this.speedx > this.speedx2) {
                this.speedx2++;
            }

            if (this.speedx < this.speedx2) {
                this.speedx2--;
            }

            if (this.speedy > this.speedy2) {
                this.speedy2++;
            }

            if (this.speedy < this.speedy2) {
                this.speedy2--;
            }

            this.delx = this.tab[this.tabb + 3];
        }

        this.del--;

        if (this.del === 0) {
            console.log(this.del, this.tabb, this.speedx, this.speedy, this.speedz);
            this.tabb += 5;

            if (this.tabb >= this.tab.length) {
                this.tabb = 0;
            }

            this.speedx = this.tab[this.tabb + 0];
            this.speedy = this.tab[this.tabb + 1];
            this.speedz = this.tab[this.tabb + 2];

            this.del = this.tab[this.tabb + 4];
        }

        for (var i = 0; i < this.max; i++) {
            var perspective = ppDist / (ppDist - this.zz[i]);

            this.balls[i].x = (this.width / 2) + this.xx[i] * perspective;
            this.balls[i].y = 300 + this.yy[i] * perspective;
            this.balls[i].alpha = Math.min(perspective / 2, 1);
            this.balls[i].scale.set(perspective / 2);

            this.xx[i] += this.speedx2;
            this.yy[i] += this.speedy2;
            this.zz[i] -= this.speedz2;

            if (this.xx[i] < -this.width) {
                this.xx[i] = this.xx[i] + (this.width * 2);
            }

            if (this.xx[i] >= this.width) {
                this.xx[i] = this.xx[i] - (this.width * 2);
            }

            if (this.yy[i] < -600) {
                this.yy[i] = this.yy[i] + 1200;
            }

            if (this.yy[i] >= 600) {
                this.yy[i] = this.yy[i] - 1200;
            }

            if (this.zz[i] < -this.width) {
                this.zz[i] += (this.width * 2);
            }

            if (this.zz[i] > this.width) {
                this.zz[i] -= (this.width * 2);
            }


        }
    }

}

window.onload = () => {
    var game = new Starfield();
};