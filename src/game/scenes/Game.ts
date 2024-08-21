import { getSubUserListReq } from "@/api/common";
import { EventBus } from "../EventBus";
import { endGameReq } from "@/api/game";

export default class MainGame extends Phaser.Scene {
    private emojis: any;
    private circle1: any;
    private circle2: any;
    private child1: any;
    private child2: any;
    private selectedEmoji: any;
    private matched: any;
    private score: any;
    private scoreText: any;
    private timer: any;
    private shakeTimer: any;
    private timerText: any;
    private width: number = 0;
    private height: number = 0;
    private totalScoreText: Phaser.GameObjects.Text | undefined;
    private totalScore: number = 0;
    private newTotalScore: number = 0;
    private isStart: Boolean = false;
    private fontStyle: any = {
        fontFamily: 'Arial',
        fontSize: 22,
        color: '#ffffff',
        fontStyle: 'bold',
        padding: 16,
        shadow: {
            color: '#000000',
            fill: true,
            offsetX: 2,
            offsetY: 2,
            blur: 4
        }
    };
    constructor() {
        super('MainGame');

        this.emojis;

        this.circle1;
        this.circle2;

        this.child1;
        this.child2;

        this.selectedEmoji = null;
        this.matched = false;

        this.score = 0;
        this.scoreText;

        this.timer;
        this.timerText;
        this.shakeTimer;

    }

    init() {
        // Fadein camera
        this.cameras.main.fadeIn(500);
    }
    closeButton(width: number) {
        const closeIcon = this.add.image(width - 25, 30, "exit").setName("exit").setScale(0.5, 0.5)
        closeIcon.setInteractive();
        closeIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
            EventBus.emit('exit', true)
        });
    }

    volumeButton() {
        const volumeIcon = this.add.image(25, 30, "volume-icon").setName("volume-icon");
        volumeIcon.setInteractive();

        // Mouse enter
        volumeIcon.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.input.setDefaultCursor("pointer");
        });
        // Mouse leave
        volumeIcon.on(Phaser.Input.Events.POINTER_OUT, () => {
            console.log("Mouse leave");
            this.input.setDefaultCursor("default");
        });
        const volume = localStorage.getItem('volume') || 1 as any
        volumeIcon.setTexture(`${volume == 1 ? 'volume-icon' : 'volume-icon_off'}`)
        volumeIcon.setAlpha(volume == 1 ? 1 : 0.5);
        console.log(volume)
        volumeIcon.on(Phaser.Input.Events.POINTER_DOWN, () => {
            if (this.sound.volume === 0) {
                this.sound.setVolume(1);
                localStorage.setItem('volume', '1')
                volumeIcon.setTexture("volume-icon");
                volumeIcon.setAlpha(1);
            } else {
                localStorage.setItem('volume', '0')
                this.sound.setVolume(0);
                volumeIcon.setTexture("volume-icon_off");
                volumeIcon.setAlpha(.5)
            }
        });
    }

    create() {
        const screen = document.getElementById('root')!
        const width = screen.clientWidth
        const height = screen.clientHeight
        this.width = width
        this.height = height
        const bgWidth = 1080
        const bgHeight = 2297
        this.add.image(width / 2, height / 2, 'dark').setScale(width / bgWidth, height / bgHeight).setInteractive;
        this.volumeButton()
        // this.closeButton(width)
        this.circle1 = this.add.circle(0, 0, 36).setStrokeStyle(3, 0xf8960e);
        this.circle2 = this.add.circle(0, 0, 36).setStrokeStyle(3, 0x00ff00);

        this.circle1.setVisible(false);
        this.circle2.setVisible(false);

        //  Create a 4x4 grid aligned group to hold our sprites

        this.emojis = this.add.group({
            key: 'emojis',
            frameQuantity: 1,
            repeat: 15,
            gridAlign: {
                width: 4,
                height: 4,
                cellWidth: 80,
                cellHeight: 80,
                x: width / 2 - 150,
                y: height / 2 - 120,
                position: 0
            }
        });


        this.timerText = this.add.text(50, 70, '30:00', this.fontStyle).setOrigin(0.5, 0.5);
        this.scoreText = this.add.text(width - 60, 70, `Score:${this.score}`, { ...this.fontStyle, color: '#ff0000' }).setOrigin(0.5, 0.5);

        // 假设 game 是 Phaser 游戏实例
        let graphics = this.add.graphics();

        // 圆角半径
        let cornerRadius = 4;

        // 边框宽度
        let borderWidth = 2;

        // 边框颜色
        let borderColor = 0xffffff; // 红色

        // 绘制圆角矩形
        graphics.lineStyle(borderWidth, borderColor);
        graphics.strokeRoundedRect(15, 55, 70, 30, cornerRadius);

        let children = this.emojis.getChildren();

        children.forEach((child: any) => {

            child.setInteractive();

        });

        this.input.on('gameobjectdown', this.selectEmoji, this);
        // this.input.once('pointerdown', this.start, this);

        this.arrangeGrid();

        EventBus.emit('current-scene-ready', this);
    }

    start(pointer: any, emoji: any) {
        if (emoji.type && emoji.name == 'volume-icon') {
            return
        }
        this.score = 0;
        this.matched = false;

        this.timer = this.time.addEvent({ delay: 30000, callback: this.gameOver, callbackScope: this });
        // this.shakeTimer = this.time.addEvent({ delay: 27000, callback: this.shake, callbackScope: this });
        this.sound.play('countdown', { delay: 27 });
        this.isStart = true
    }

    shake() {
        this.cameras.main.shake(100, 0.01);
    }

    selectEmoji(pointer: any, emoji: any) {
        if (!this.isStart) {
            this.start(pointer, emoji)
        }

        if (emoji.type && emoji.name == 'volume-icon') {
            return
        }

        if (this.matched) {
            return;
        }

        //  Is this the first or second selection?
        if (!this.selectedEmoji) {
            //  Our first emoji
            this.circle1.setPosition(emoji.x, emoji.y);
            this.circle1.setVisible(true);

            this.selectedEmoji = emoji;
        }
        else if (emoji !== this.selectedEmoji) {
            //  Our second emoji

            //  Is it a match?
            if (emoji.frame.name === this.selectedEmoji.frame.name) {
                this.circle1.setStrokeStyle(3, 0x00ff00);
                this.circle2.setPosition(emoji.x, emoji.y);
                this.circle2.setVisible(true);

                this.tweens.add({
                    targets: [this.child1, this.child2],
                    scale: 1.4,
                    angle: '-=30',
                    yoyo: true,
                    ease: 'sine.inout',
                    duration: 200,
                    completeDelay: 200,
                    onComplete: () => this.newRound()
                });

                this.sound.play('match');
            }
            else {
                this.circle1.setPosition(emoji.x, emoji.y);
                this.circle1.setVisible(true);

                this.selectedEmoji = emoji;
            }
        }
    }

    newRound() {
        this.matched = false;

        this.score++;

        this.scoreText.setText('Score: ' + this.score * 100);

        this.circle1.setStrokeStyle(3, 0xf8960e);

        this.circle1.setVisible(false);
        this.circle2.setVisible(false);

        //  Stagger tween them all out
        this.tweens.add({
            targets: this.emojis.getChildren(),
            scale: 0,
            ease: 'power2',
            duration: 600,
            delay: this.tweens.stagger(100, { grid: [4, 4], from: 'center' }),
            onComplete: () => this.arrangeGrid()
        });
    }

    arrangeGrid() {
        //  We need to make sure there is only one pair in the grid
        //  Let's create an array with all possible frames in it:

        let frames = Phaser.Utils.Array.NumberArray(1, 40);
        let selected = Phaser.Utils.Array.NumberArray(0, 15);
        let children = this.emojis.getChildren();

        //  Now we pick 16 random values, removing each one from the array so we can't pick it again
        //  and set those into the sprites

        for (let i = 0; i < 16; i++) {
            let frame = Phaser.Utils.Array.RemoveRandomElement(frames);

            children[i].setFrame('smile' + frame);
        }

        //  Finally, pick two random children and make them a pair:
        let index1 = Phaser.Utils.Array.RemoveRandomElement(selected) as any;
        let index2 = Phaser.Utils.Array.RemoveRandomElement(selected) as any;

        this.child1 = children[index1];
        this.child2 = children[index2];

        //  Set the frame to match
        this.child2.setFrame(this.child1.frame.name);

        console.log('Pair: ', index1, index2);

        //  Clear the currently selected emojis (if any)
        this.selectedEmoji = null;

        //  Stagger tween them all in
        this.tweens.add({
            targets: children,
            scale: { start: 0, from: 0, to: 1 },
            ease: 'bounce.out',
            duration: 600,
            delay: this.tweens.stagger(100, { grid: [4, 4], from: 'center' })
        });
    }

    update() {
        if (this.timer) {
            if (this.timer.getProgress() === 1) {
                this.timerText.setText('00:00');
                this.timer = null
            }
            else {
                const remaining = (30 - this.timer.getElapsedSeconds()).toPrecision(4);
                const pos = remaining.indexOf('.');

                let seconds = remaining.substring(0, pos);
                let ms = remaining.substr(pos + 1, 2);

                seconds = Phaser.Utils.String.Pad(seconds, 2, '0', 1);

                this.timerText.setText(seconds + ':' + ms);
            }
        }
        if (this.score && this.totalScoreText) {
            this.totalScore = this.totalScore + 10

            if (this.totalScore - this.newTotalScore > 30) {
                this.totalScoreText?.setText(`Score:${this.newTotalScore}`)
                this.score = 0
                this.totalScoreText = undefined
            } else {
                this.totalScoreText?.setText(`Score:${Math.min(this.totalScore, this.newTotalScore)}`)
            }
        }
    }

    async gameOver() {
        //  Show them where the match actually was
        this.circle1.setStrokeStyle(4, 0xfc29a6).setPosition(this.child1.x, this.child1.y).setVisible(true);
        this.circle2.setStrokeStyle(4, 0xfc29a6).setPosition(this.child2.x, this.child2.y).setVisible(true);
        this.time.removeAllEvents()
        this.timer = null
        setTimeout(() => {
            localStorage.setItem('currentScore', this.score)
            this.scene.start('GameOver')
        }, 1000);
    }
}
