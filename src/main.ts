import './style.css'
import Phaser from 'phaser'
import { GameScene } from './game/scenes/GameScene'
import { MenuScene } from './game/scenes/MenuScene'
import { LobbyScene } from './game/scenes/LobbyScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: 'app',
  backgroundColor: '#eaf4ff',

  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        x: 0,
        y: 0,
      },
      debug: false,
    },
  },

  scene: [MenuScene, LobbyScene, GameScene],

  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
}

new Phaser.Game(config)