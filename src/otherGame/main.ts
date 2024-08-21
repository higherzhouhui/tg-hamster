import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import MainMenu from './scenes/MainMenu';
import MainGame from './scenes/Game';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#181818',
  scene: [
    Boot,
    Preloader,
    MainMenu,
    MainGame,
    GameOver
  ]
};

const StartGame = (parent: string) => {
  const screen = document.getElementsByClassName('layout')
  const width = screen[0].clientWidth
  const height = screen[0].clientHeight
  return new Game({ ...config, parent, width, height });
}

export default StartGame;