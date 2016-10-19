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

class Path {
    paths: Array<PathComponent>;
    currentPath: PathComponent;
    currentPathIndex: number = 0;
    clock: number = 0;

    private _dx: number = 0;
    private _dy: number = 0;
    private _dz: number = 0;

    accel: number = 6;

    constructor(paths: Array<PathComponent>) {
        this.paths = paths;
        this.currentPath = paths[0];
    }

    get dx(): number {
        return this._dx;
    }
    get dy(): number {
        return this._dy;
    }
    get dz(): number {
        return this._dz;
    }

    update(time: number) {
        this.clock += time;
        if (this.clock > this.currentPath.del) {
            this.advance();
        }

        if (this._dx < this.currentPath.dx) {
            this._dx += this.accel * time;
        } else if (this._dx > this.currentPath.dx) {
            this._dx -= this.accel * time;
        }

        if (this._dy < this.currentPath.dy) {
            this._dy += this.accel * time;
        } else if (this._dy > this.currentPath.dy) {
            this._dy -= this.accel * time;
        }

        if (this._dz < this.currentPath.dz) {
            this._dz += this.accel * time;
        } else if (this._dz > this.currentPath.dz) {
            this._dz -= this.accel * time;
        }
    }

    advance() {
        this.currentPathIndex += 1;
        if (this.currentPathIndex >= this.paths.length) {
            this.currentPathIndex = 0;
        }
        console.log(this.currentPath);
        this.currentPath = this.paths[this.currentPathIndex];
        this.clock = 0;
    }
}

class Starfield3 {
    width: number;
    max: number = 164;

    useAlpha: boolean = true;
    useScale: boolean = true;
    usePerspective: boolean = true;

    xx: number[] = [];
    yy: number[] = [];
    zz: number[] = [];

    balls: Sprite[] = [];

    constructor(game: Phaser.Game, width: number) {
        let sprites: SpriteBatch = game.add.spriteBatch(game.world);
        this.width = width;

        if (game.renderType == Phaser.WEBGL) {
            this.max = 3000;
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
            let star = game.make.sprite(0, 0, starname);
            star.anchor.set(2);

            sprites.addChild(star);

            this.balls.push(star);
        }
    }

    toggleUseAlpha() {
      this.useAlpha = !this.useAlpha;
    }

    toggleUseScale() {
      this.useScale = !this.useScale;
    }

    toggleUsePerspective() {
      this.usePerspective = !this.usePerspective;
    }

    moveStars(dx: number, dy: number, dz: number) {
        var ppDist = this.width;

        for (var i = 0; i < this.max; i++) {
            var perspective = ppDist / (ppDist - this.zz[i]);
            if (this.usePerspective) {
                this.balls[i].x = (this.width / 2) + this.xx[i] * perspective;
                this.balls[i].y = 300 + this.yy[i] * perspective;
            } else {
                this.balls[i].x = (this.width / 2) + this.xx[i] * 1.0;
                this.balls[i].y = 300 + this.yy[i] * 1.0;
            }

            if (this.useAlpha) {
                this.balls[i].alpha = Math.min(perspective / 2, 1);
            }
            if (this.useScale) {
                this.balls[i].scale.set(perspective / 2);
            }

            this.xx[i] += dx;
            this.yy[i] += dy;
            this.zz[i] -= dz;

            this.resetOutOfBounds(i);
        }
    }

    resetOutOfBounds(i: number) {
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

class Starfield2 {

    width: number;

    game: Phaser.Game;

    starfield: Starfield3

    tab: Array<number> = [
        0, 0, -16, 25, 1.6,
        2, 4, -16, 25, 1.6,
        18, 4, -8, 25, 1.6,
        4, 8, 8, 25, 1.6,
        -16, 8, 8, 10, 2.6,
        0, 0, -8, 25, 4.4,
        0, 8, 0, 25, 3.8,
        0, 8, 8, 25, 1.6,
        0, 0, 8, 25, 1.6,
        8, 0, 8, 25, 3.8,
        0, 8, 8, 25, 3.8,
        8, 0, 8, 25, 3.8,
        0, 16, 8, 25, 3.2];
    path: Path;

    constructor() {
        this.width = window.innerWidth;

        this.game = new Phaser.Game(this.width, 600, Phaser.AUTO, 'content', {
            preload: () => this.preload(),
            create: () => this.create(),
            update: () => this.update()
        });

        let pathComponents: PathComponent[] = [];
        for (var i=0; i<this.tab.length/5; i++) {
            pathComponents.push(new PathComponent(this.tab[i*5+0], this.tab[i*5+1], this.tab[i*5+2], this.tab[i*5+3] ,this.tab[i*5+4]));
        }
        this.path = new Path(pathComponents);

        console.log(this.path);
    }

    preload() {
        this.game.load.image('star', 'images/star.png');
        this.game.load.image('star2', 'images/star2.png');
        this.game.load.image('star3', 'images/star3.png');
    }

    create() {

        this.starfield = new Starfield3(this.game, this.width);

        this.game.input.keyboard.addKey(Phaser.Keyboard.ONE).onDown.add(() => {
          this.starfield.toggleUseAlpha();
        });
        this.game.input.keyboard.addKey(Phaser.Keyboard.TWO).onDown.add(() => {
          this.starfield.toggleUseScale;
        });
        this.game.input.keyboard.addKey(Phaser.Keyboard.THREE).onDown.add(()=> {
          this.starfield.toggleUsePerspective;
        });

    }

    update() {
        this.path.update(this.game.time.physicsElapsed);
        this.starfield.moveStars(this.path.dx, this.path.dy, this.path.dz);
    }
}

window.onload = () => {
    var game = new Starfield2();
};
