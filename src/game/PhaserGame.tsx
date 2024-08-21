import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';
import UtilsEventBus from "@/utils/eventBus";
import { useNavigate } from 'react-router-dom';

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
    const utilsEventBus = UtilsEventBus.getInstance()
    const navigate = useNavigate()
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
        EventBus.on('exit', (flag: boolean) => {
            navigate('-1')
        })
        return () => {
            EventBus.removeListener('current-scene-ready');
            EventBus.removeListener('exit');
        }
    }, [currentActiveScene, ref]);

    return (
        <div id="game-container"></div>
    );

});
