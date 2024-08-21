import { Scene } from 'phaser';
import { EventBus } from '../EventBus';

export class Preloader extends Scene {

    private loadText: any;
    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        const screen = document.getElementById('root')!
        const width = screen.clientWidth
        const height = screen.clientHeight
        const bgWidth = 1080
        const bgHeight = 2297
        this.add.image(width / 2, height / 2, 'dark').setScale(width / bgWidth, height / bgHeight);
        //  A simple progress bar. This is the outline of the bar.
        const barWidth = Math.max(width / 2, 280)
        this.add.rectangle(width / 2, height / 2, barWidth, 19).setStrokeStyle(1, 0xffffff);
        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(width / 2 - barWidth / 2 + 5, height / 2, 4, 14, 0xffffff);
        this.loadText = this.add.text(width / 2, height / 2 - 40, `${0}%`, { fontFamily: 'Arial', fontSize: 24, color: '#e3f2ed' }).setOrigin(0.5, 0.5);
        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = (barWidth * progress - 5);
            this.loadText.setText(`${Math.floor(progress * 100)}%`)
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        // this.loadText = this.add.text(200, 300, 'Loading ...', { fontFamily: 'Arial', fontSize: 32, color: '#e3f2ed' });
        // this.loadText.setOrigin(0.5);
        // this.loadText.setStroke('#203c5b', 6);
        // this.loadText.setShadow(2, 2, '#2d2d2d', 4, true, false);


        this.load.setPath('assets/games/emoji-match/');
        this.load.image('background', 'background.png');
        this.load.image('logo', 'logo.png');
        this.load.atlas('emojis', 'emojis.png', 'emojis.json');
        this.load.image("volume-icon", "volume-icon.png");
        this.load.image("volume-icon_off", "volume-icon_off.png");
        this.load.image("exit", "exit.png");

        //  Audio ...
        this.load.setPath('assets/games/emoji-match/sounds/');
        this.load.audio("card-mismatch", "card-mismatch.mp3");

        this.load.audio('music', ['music.ogg', 'music.m4a', 'music.mp3']);
        this.load.audio('countdown', ['countdown.ogg', 'countdown.m4a', 'countdown.mp3']);
        this.load.audio('match', ['match.ogg', 'match.m4a', 'match.mp3']);
    }

    create() {

        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        if (this.sound.locked) {
            this.scene.start('MainMenu');
        }
        else {
            this.scene.start('MainMenu');
        }
    }
}
