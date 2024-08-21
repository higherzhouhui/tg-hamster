import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera | undefined;
  background: Phaser.GameObjects.Image | undefined;
  gameOverText: Phaser.GameObjects.Text | undefined;
  constructor() {
    super('GameOver');
  }
  create() {
    EventBus.emit('current-scene-ready', this);
  }
  changeScene() {
    this.scene.start('MainMenu');
  }
}