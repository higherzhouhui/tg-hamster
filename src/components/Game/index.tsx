import { useEffect, useRef, useState } from 'react';
import { IRefPhaserGame, PhaserGame } from '@/game/PhaserGame';
import MainMenu from '@/game/scenes/MainMenu';
import { useSelector } from 'react-redux';
import './index.scss'

function GameComp() {
  // The sprite can only be moved in the MainMenu Scene
  const userInfo = useSelector((state: any) => state.user.info);

  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef<IRefPhaserGame | null>(null);
  const [currentScene, setCurrentScene] = useState('preLoad')

  const changeTotalScore = () => {

    if (phaserRef.current) {
      const scene = phaserRef.current.scene;
      if (scene) {
        if (currentScene == 'MainMenu') {
          let mainScene = scene as any
          mainScene.showTotal(userInfo)
        }

      }
    }
  }

  // Event emitted from the PhaserGame component
  const currentActiveScene = (scene: Phaser.Scene) => {

    setCurrentScene(scene.scene.key);

  }

  useEffect(() => {
    changeTotalScore()
  }, [phaserRef.current?.scene])

  return (
    <div>
      <PhaserGame ref={phaserRef} currentActiveScene={currentActiveScene} />
    </div>
  )
}

export default GameComp
