import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';

export interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void
  size?: { width: number, height: number }
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame({ currentActiveScene, size }, ref) {
  const game = useRef<Phaser.Game | null>(null!);
  const gameWrapper: any = useRef()
  const [execTypeCmd, setExecTypeCmd] = useState('')
  const [clickTomato, setClickTomato] = useState({
    show: false,
    top: 0,
    left: 0
  })
  useLayoutEffect(() => {
    if (game.current === null) {

      game.current = StartGame("game-container");

      if (typeof ref === 'function') {
        ref({ game: game.current, scene: null });
      } else if (ref) {
        ref.current = { game: game.current, scene: null };
      }

    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        if (game.current !== null) {
          game.current = null;
        }
      }
    }
  }, [ref]);

  useEffect(() => {
    EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {
      if (currentActiveScene && typeof currentActiveScene === 'function') {
        currentActiveScene(scene_instance);
      }

      if (typeof ref === 'function') {

        ref({ game: game.current, scene: scene_instance });
      } else if (ref) {

        ref.current = { game: game.current, scene: scene_instance };
      }

    });
    EventBus.on('execTypeCmd', (type: string) => {
      setExecTypeCmd(type)
    })
    EventBus.on('execBoom', (data: any) => {
      setClickTomato(data)
    })
    return () => {
      EventBus.removeListener('current-scene-ready');
      EventBus.removeListener('execTypeCmd');
      EventBus.removeListener('execBoom');
    }
  }, [currentActiveScene, ref]);

  return (
    <div ref={gameWrapper}>
      <div id='game-container' />
      <div className='freeze-gif' style={{ opacity: execTypeCmd == 'freeze' ? 1 : 0, zIndex: execTypeCmd == 'freeze' ? 10 : -1 }}>
        <img src='/assets/game/freezeAg.gif' alt='gif' className='tl' />
        <img src='/assets/game/freezeAg.gif' alt='gif' className='tr' />
        <img src='/assets/game/freezeAg.gif' alt='gif' className='bl' />
        <img src='/assets/game/freezeAg.gif' alt='gif' className='br' />
      </div>
      <img src='/assets/game/click.gif' alt='boom' className='get-score' style={{ left: clickTomato.left, top: clickTomato.top, opacity: clickTomato.show ? 1 : 0, zIndex: clickTomato ? 10 : -1 }} />
    </div>
  );
});