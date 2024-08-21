import { EventBus } from "../EventBus";
export default class MainMenu extends Phaser.Scene {
    private fontStyle: any = {
        fontFamily: 'Arial',
        fontSize: 34,
        color: '#ffffff',
        fontStyle: 'bold',
        padding: 16,
        align: 'center',
        lineHeight: 36,
    };
    private music: any;
    private totalScoreText: any;
    private totalScore: number = 0;
    private maxScore: number = 0;
    private kouFen: boolean = false;
    private target: number = 0;
    constructor() {
        super('MainMenu');
    }

    create() {
        const screen = document.getElementById('root')!
        const width = screen.clientWidth
        const height = screen.clientHeight
        const bgWidth = 1080
        const bgHeight = 2297
        let background = this.add.image(width / 2, height / 2, 'dark').setScale(width / bgWidth, height / bgHeight).setInteractive();
        this.volumeButton()
        // this.closeButton(width)
        this.tweens.add({
            targets: background,
            alpha: { from: 0, to: 1 },
            duration: 1000
        });

        this.add.text(width / 2, height / 2 + 200, 'warning: find two identical expressions\n and eliminate them before clearing the level', { ...this.fontStyle, fontSize: 13, color: '#f5f5f5' }).setOrigin(0.5, 0.5);

        const titleText = this.add.text(width / 2, height / 2 + 120,
            "Click to Play",
            { align: "center", strokeThickness: 4, fontSize: 32, fontStyle: "bold", color: "#000000" }
        )
            .setOrigin(.5)
            .setDepth(3)
        // title tween like retro arcade
        const titleTextAnimation = this.add.tween({
            targets: titleText,
            duration: 800,
            ease: (value: any) => (value > .8),
            alpha: 0,
            yoyo: true,
            repeat: -1,
        });
        if (!this.music) {
            this.music = this.sound.play('music', { loop: true });
        }
        const volume = localStorage.getItem('volume') || 1 as any

        this.sound.setVolume(volume);


        let logo = this.add.image(width / 2, 0, 'logo');
        this.tweens.add({
            targets: logo,
            y: height / 2 - 100,
            alpha: { from: 0, to: 1 },
            ease: 'bounce.out',
            duration: 1200,
        });

        background.on(Phaser.Input.Events.POINTER_DOWN, async () => {
            this.scene.start('MainGame');
        });



        // this.input.once('pointerdown', async () => {
        //     // 暂停click动画和隐藏click to play
        //     titleTextAnimation.stop()
        //     titleText.setAlpha(0)
        //     const res: any = await beginGameReq()
        //     if (res.code != 0) {
        //         this.sound.play("card-mismatch")
        //         // this.sound.setVolume(0);
        //         this.totalScoreText.setColor('#e20f0f')
        //         this.cameras.main.shake(300, 0.01);
        //     } else {
        //         this.kouFen = true
        //         this.target = res.data.score
        //         this.registry.set('totalScore', res.data.score)
        //     }
        // });
        EventBus.emit('current-scene-ready', this);
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


    update() {
        if (this.kouFen) {
            this.totalScore = this.totalScore - 20
            if (this.totalScore < this.target) {
                this.totalScoreText.setText(`Score: ${this.target}`)
                if (this.target - this.totalScore > 500) {
                    this.scene.start('MainGame');
                    this.kouFen = false
                }
            } else {
                this.totalScoreText.setText(`Score: ${this.totalScore}`)
            }
        }
    }

    showTotal(userInfo: any) {
        // const screen = document.getElementById('root')!
        // const width = screen.clientWidth
        // const height = screen.clientHeight

        // if (!this.totalScore) {
        //     this.totalScore = userInfo.score
        //     this.maxScore = userInfo.game_max_score

        //     this.registry.set('totalScore', this.totalScore)
        // } else {
        //     this.totalScore = this.registry.get('totalScore')
        // }

        // this.totalScoreText = this.add.text(width / 2, height / 2 - 220, `Score:${this.totalScore || 0}`, this.fontStyle).setOrigin(0.5, 0.5);

        // this.tweens.add({
        //     targets: this.totalScoreText,
        //     alpha: { from: 0, to: 1 },
        //     scale: { from: 0, to: 1 },
        //     duration: 1000,
        // })



    }
}
