import React from 'react';

import Phaser from 'phaser';

export interface GameBoardProps {
  autoFocus: boolean;
}

class GameBoard extends React.PureComponent<GameBoardProps> {
  private game?: Phaser.Game;
  private graphics?: Phaser.GameObjects.Graphics;
  private player?: Phaser.Physics.Matter.Image;

  constructor(props: GameBoardProps) {
    super(props);

    this.setPhaserObjects(props);
  }

  render() {
    return <></>;
  }

  setPhaserObjects(props: GameBoardProps) {
    const { autoFocus } = props;

    // game 오브젝트는 딱히 바뀔일이 없고 이게 바뀐다고 re-render할 필요는 없으니까
    // 굳이 state로 쓰진 않는다.
    this.game = new Phaser.Game({
      autoFocus,
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true,
      },
      physics: {
        default: 'matter',
      },
      scene: {
        create: this.createGame,
        update: this.updateGame,
        preload: this.preloadGameAssets,
        extend: {
          setWorldBoundsAndCamera: this.setWorldBoundsAndCamera,
          setBackgrounds: this.setBackgrounds,
          setPlayer: this.setPlayer,
          addDragEventListener: this.addDragEventListener,
        },
      },
    });
  }

  preloadGameAssets() {
    /**
     * CAUTION: "this" doesnot mean GameBoard class.
     * This method is not binded to this class.
     */
    const scene: Phaser.Scene = (this as any) as Phaser.Scene;
    scene.load.image('background-tile', '/static/in-game/background.png');
    scene.load.image('player-black', '/static/in-game/player.png');
  }

  createGame() {
    /**
     * CAUTION: "this" doesnot mean GameBoard class.
     * This method is not binded to this class.
     */
    const scene: Phaser.Scene = (this as any) as Phaser.Scene;
    this.setWorldBoundsAndCamera(scene);
    this.setBackgrounds(scene);
    this.setPlayer(scene);

    this.graphics = scene.add.graphics();
    this.addDragEventListener(scene, this.graphics);
  }

  setWorldBoundsAndCamera(scene: Phaser.Scene) {
    scene.matter.world.setBounds();
    // scene.cameras.main.setBounds(-512, -512, 1024, 1024);
    scene.cameras.main.setZoom(1);
  }

  setBackgrounds(scene: Phaser.Scene) {
    scene.add.tileSprite(-512, -512, 2048, 2048, 'background-tile').setOrigin(0);
  }

  setPlayer(scene: Phaser.Scene): Phaser.Physics.Matter.Image {
    this.player = scene.matter.add.image(0, 0, 'player-black');
    this.player.setBounce(1);
    this.player.setFrictionAir(0.1);
    this.player.setIgnoreGravity(true);
    scene.cameras.main.startFollow(this.player, true);

    return this.player;
  }

  addDragEventListener(scene: Phaser.Scene, graphics: Phaser.GameObjects.Graphics) {
    const draggingIndicator = new Phaser.Geom.Line();
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      graphics.clear();
      graphics.lineStyle(1, 0xffffff, 1);

      if (this.player) {
        draggingIndicator.setTo(this.player.x, this.player.y, pointer.worldX, pointer.worldY);
      }
    });

    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        draggingIndicator.x2 = pointer.worldX;
        draggingIndicator.y2 = pointer.worldY;

        graphics.clear();
        graphics.lineStyle(1, 0xffffff, 1);
        graphics.strokeLineShape(draggingIndicator);
      }
    });

    scene.input.on('pointerup', (_: any, gameObject: Phaser.Physics.Arcade.Image) => {
      graphics.clear();
      const velocityX = draggingIndicator.x1 - draggingIndicator.x2;
      const velocityY = draggingIndicator.y1 - draggingIndicator.y2;

      if (this.player) {
        this.player.setVelocity(velocityX * 0.05, velocityY * 0.05);
      }
    });
  }

  updateGame(data: object) {
    if (!this.graphics) return;
  }
}

export default GameBoard;
