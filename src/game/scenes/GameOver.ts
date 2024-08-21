import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera | undefined;
    background: Phaser.GameObjects.Image | undefined;
    gameOverText: Phaser.GameObjects.Text | undefined;
    private scoreText: Phaser.GameObjects.Text | undefined;
    private totalScore: number = 0;
    constructor() {
        super('GameOver');
    }
    create() {
        const screen = document.getElementById('root')!
        const width = screen.clientWidth
        const height = screen.clientHeight
        let background = this.add.image(width / 2, height / 2, 'background');

        this.tweens.add({
            targets: background,
            alpha: { from: 0, to: 1 },
            duration: 1000
        });


        const fontStyle: any = {
            fontFamily: 'Arial',
            fontSize: 32,
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


        const gameOverText = this.add.text(width / 2, 0, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5, 0.5).setDepth(100);


        this.tweens.add({
            targets: gameOverText,
            y: height / 2,
            ease: 'bounce.out',
        })

        const foundText = this.add.text(width / 2, height / 2 - 200, 'Found: ' + `${this.registry.get('found') ? this.registry.get('found') : 0}`, fontStyle).setOrigin(0.5, 0.5);
        this.tweens.add({
            targets: foundText,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.5, to: 1 },
            duration: 1000,
        })

        this.totalScore = this.registry.get('totalScore')
        const maxFound = localStorage.getItem('maxFound') || 0
        if (this.registry.get('found') && this.registry.get('found') > maxFound) {
            localStorage.setItem('maxFound', this.registry.get('found'))
        }
        this.scoreText = this.add.text(width / 2, height / 2 - 150, 'Score: ' + `${this.registry.get('totalScore') ? this.registry.get('totalScore') : 0}`, fontStyle).setOrigin(0.5, 0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });

        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('MainMenu');
    }
    update() {
        if (this.registry.get('found')) {
            this.totalScore = this.totalScore + 2
            if (this.totalScore - this.registry.get('totalScore') > this.registry.get('found') * 600) {
                this.scoreText?.setText(`Score:${this.registry.get('totalScore') - this.registry.get('found') * 600}`)
            } else {
                this.scoreText?.setText(`Score:${this.totalScore}`)
            }
        }
    }
}
