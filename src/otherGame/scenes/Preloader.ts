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
    // main
    this.load.setPath('assets/game');
    this.load.image('game-cat', 'game-cat.png')
    this.load.image('cat', 'cat.png')
    this.load.image('unit', 'unit.png')
    this.load.image('freezeBg', 'freezeBg.png')
    this.load.image('boomBg', 'boomBg.png')
    this.load.image('freeze', 'freeze.gif')
    this.load.image('boom', 'boom.gif')
  }

  create() {
    EventBus.emit('current-scene-ready', this);

    this.scene.start('MainGame');
  }
}