// TODO game 오브젝트 destory할 때 window.onresize도 같이 해제해주세요!
import Phaser from 'phaser';

const MARGIN_OF_MAP = 0;
const MARGIN_OF_BORDER = 0;
const ZOOME_LEVEL_OF_CAMERA = 1.85;

// 정상
const VELOCITY_FACTOR = 0.2;
const FRICTION_AIR = 0.06;
const FRICTION = 0.05;
const BOUND_RATE = 1.25;

// true 오일
// const VELOCITY_FACTOR = 0.20;
// const FRICTION_AIR = 0.03;
// const FRICTION = 0.03;
// const BOUND_RATE = 1;

// 무중력
// const VELOCITY_FACTOR = 0.08;
// const FRICTION_AIR = 0.0;
// const FRICTION = 0.0;
// const BOUND_RATE = 1;

const DRAG_LINE_COLOR = 0x666666;

const MINIMAP_MARGIN = 50;
const MINIMAP_SIZE = 300;

export interface GameBoardOptions {
  autoFocus: boolean;

  width: number;
  height: number;

  parent?: string;

  onDestroy: () => void;
}

class GameBoard {
  private options: GameBoardOptions;

  public game?: Phaser.Game;
  private graphics?: Phaser.GameObjects.Graphics;
  private player?: Phaser.Physics.Matter.Image;

  private minimap?: Phaser.Cameras.Scene2D.Camera;
  private isDragging: boolean = false;

  private otherPlayers: Phaser.Physics.Matter.Image[] = [];

  constructor(options: GameBoardOptions) {
    this.options = options;

    this.setPhaserObjects();
  }

  setPhaserObjects() {
    const { autoFocus, width, height, parent, onDestroy } = this.options;

    // game 오브젝트는 딱히 바뀔일이 없고 이게 바뀐다고 re-render할 필요는 없으니까
    // 굳이 state로 쓰진 않는다.
    this.game = new Phaser.Game({
      autoFocus,
      type: Phaser.AUTO,
      parent,
      scale: {
        width,
        height,
        mode: Phaser.Scale.ENVELOP,
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
          drawBackgroundBorder: this.drawBackgroundBorder,
          setPlayer: this.setPlayer,
          addDragEventListener: this.addDragEventListener,
          createPlayer: this.createPlayer,
          calculateWindowSize: this.calculateWindowSize,
          game: this.game,
          onDestroy,
          otherPlayers: [],
        },
      },
    });
  }

  preloadGameAssets() {
    /**
     * CAUTION: "this" does not mean GameBoard class.
     * This method is not binded to this class.
     */
    const scene: Phaser.Scene = (this as any) as Phaser.Scene;
    scene.load.image('background-tile', '/static/in-game/background.png');
    scene.load.image('player-black', '/static/in-game/player.png');
    scene.load.image('dragging-arrow', '/static/in-game/arrow.png');
  }

  createGame() {
    /**
     * CAUTION: "this" does not mean GameBoard class.
     * This method is not binded to this class.
     */
    const scene: Phaser.Scene = (this as any) as Phaser.Scene;

    this.setWorldBoundsAndCamera(scene);
    this.setBackgrounds(scene);
    this.drawBackgroundBorder(scene);
    this.setPlayer(scene);
    this.addDragEventListener(scene);

    scene.matter.world.on('collisionstart', (event: any) => {
      const eventBodies = event.pairs[0];
      if (eventBodies.bodyA.isStatic || eventBodies.bodyB.isStatic) {
        if (eventBodies.bodyA.label == 'My Player' || eventBodies.bodyB.label == 'My Player') {
          console.log('Game Over');
          // if (this.player) this.player.destroy(true);
          // (this as any).onDestroy(true);
        } else {
          if (eventBodies.bodyA.label.startsWith('player')) {
            const otherPlayer = this.otherPlayers[parseInt(eventBodies.bodyA.label.replace('player ', ''), 10)];
            otherPlayer.setVisible(false);
            eventBodies.bodyA.destroy(true);
          } else {
            const otherPlayer = this.otherPlayers[parseInt(eventBodies.bodyB.label.replace('player ', ''), 10)];
            otherPlayer.setVisible(false);
            eventBodies.bodyB.destroy(true);
          }
        }
      }
    });
  }

  setWorldBoundsAndCamera(scene: Phaser.Scene) {
    scene.matter.world.setBounds();
    scene.cameras.main.setZoom(ZOOME_LEVEL_OF_CAMERA);

    this.minimap = scene.cameras.add(0, 0, MINIMAP_SIZE, MINIMAP_SIZE);
    this.minimap.setZoom(0.2).setName('mini');
    this.minimap.setBounds(0, 0, 1000, 1000);
    this.minimap.setBackgroundColor(0xffffff);

    this.calculateWindowSize(scene);
  }

  calculateWindowSize(scene: Phaser.Scene) {
    const actualWidth = window.innerWidth;
    const actualHeight = window.innerHeight;

    const canvasWidth = scene.scale.canvas.width;
    const canvasHeight = scene.scale.canvas.height;

    const canvasRatio = canvasWidth / canvasHeight;
    const windowRatio = actualWidth / actualHeight;

    if (this.minimap) {
      if (windowRatio > canvasRatio) {
        // 실제 캔버스 비율보다 윈도우 비율이 폭이 길 때
        // 그럼 높이를 신경써야 함
        const visibleCanvasHeight = canvasWidth / windowRatio;
        this.minimap.setPosition(
          canvasWidth - MINIMAP_SIZE - MINIMAP_MARGIN,
          canvasHeight - MINIMAP_SIZE - MINIMAP_MARGIN - (canvasHeight - visibleCanvasHeight) / 2,
        );
      } else if (windowRatio < canvasRatio) {
        const visibleCanvasWidth = canvasHeight * windowRatio;
        this.minimap.setPosition(
          canvasWidth - MINIMAP_SIZE - MINIMAP_MARGIN - (canvasWidth - visibleCanvasWidth) / 2,
          canvasHeight - MINIMAP_SIZE - MINIMAP_MARGIN,
        );
      } else {
        this.minimap.setPosition(
          canvasWidth - MINIMAP_SIZE - MINIMAP_MARGIN,
          canvasHeight - MINIMAP_SIZE - MINIMAP_MARGIN,
        );
      }
    }
  }

  setBackgrounds(scene: Phaser.Scene) {
    scene.add
      .tileSprite(
        -MARGIN_OF_MAP,
        -MARGIN_OF_MAP,
        scene.scale.width + MARGIN_OF_MAP * 2,
        scene.scale.height + MARGIN_OF_MAP * 2,
        'background-tile',
      )
      .setOrigin(0)
      .setAlpha(0.2);
    scene.cameras.main.setBackgroundColor(0xffffff);
  }

  drawBackgroundBorder(scene: Phaser.Scene) {
    const backgroundGraphics = scene.add.graphics();

    backgroundGraphics.lineStyle(10, 0xcccccc, 1);
    backgroundGraphics.moveTo(MARGIN_OF_BORDER, MARGIN_OF_BORDER);
    backgroundGraphics.lineTo(scene.scale.width - MARGIN_OF_BORDER, MARGIN_OF_BORDER);
    backgroundGraphics.lineTo(scene.scale.width - MARGIN_OF_BORDER, scene.scale.height - MARGIN_OF_BORDER);
    backgroundGraphics.lineTo(MARGIN_OF_BORDER, scene.scale.height - MARGIN_OF_BORDER);
    backgroundGraphics.lineTo(MARGIN_OF_BORDER, MARGIN_OF_BORDER);
    backgroundGraphics.stroke();
  }

  setPlayer(scene: Phaser.Scene): Phaser.Physics.Matter.Image {
    this.player = this.createPlayer(scene, 100, 100);
    (this.player.body as any).label = 'My Player';
    scene.cameras.main.startFollow(this.player, true);

    for (let i = 0; i < 10; i++) {
      const p = this.createPlayer(scene, 100, 100);
      p.setRandomPosition();
      (p.body as any).label = `player ${i}`;
      this.otherPlayers.push(p);
    }

    // setInterval(() => {
    //   for (let i = 0; i < 3; i++) {
    //     const index = Math.floor(Math.random() * this.otherPlayers.length);
    //     this.otherPlayers[index].setVelocity((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100);
    //   }
    // }, 100);

    return this.player;
  }

  createPlayer(scene: Phaser.Scene, x: number, y: number): Phaser.Physics.Matter.Image {
    const player = scene.matter.add.image(x, y, 'player-black');
    player.setCircle(player.width / 2, {});
    player.setBounce(BOUND_RATE);
    player.setFrictionAir(FRICTION_AIR);
    player.setFriction(FRICTION);
    player.setIgnoreGravity(true);

    return player;
  }

  addDragEventListener(scene: Phaser.Scene) {
    const draggingIndicator = new Phaser.Geom.Line();
    const draggingGraphics = scene.add.graphics();
    this.isDragging = false;

    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (
        this.player &&
        pointer.worldX > this.player.x - 25 &&
        pointer.worldX < this.player.x + 25 &&
        pointer.worldY > this.player.y - 25 &&
        pointer.worldY < this.player.y + 25
      ) {
        this.isDragging = true;
        draggingGraphics.clear();
        draggingGraphics.lineStyle(1, DRAG_LINE_COLOR, 1);

        draggingIndicator.setTo(this.player.x, this.player.y, pointer.worldX, pointer.worldY);
        draggingGraphics.strokeLineShape(draggingIndicator);

        draggingGraphics.strokeCircle(
          this.player.x,
          this.player.y,
          (Math.sqrt(Math.pow(this.player.x - pointer.worldX, 2) + Math.pow(this.player.y - pointer.worldY, 2)) * 3) /
            5,
        );
      }
    });

    scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && this.isDragging && this.player) {
        draggingIndicator.setTo(this.player.x, this.player.y, pointer.worldX, pointer.worldY);

        draggingGraphics.clear();
        draggingGraphics.lineStyle(1, DRAG_LINE_COLOR, 1);
        draggingGraphics.strokeLineShape(draggingIndicator);
        draggingGraphics.strokeCircle(
          this.player.x,
          this.player.y,
          (Math.sqrt(Math.pow(this.player.x - pointer.worldX, 2) + Math.pow(this.player.y - pointer.worldY, 2)) * 3) /
            5,
        );
      }
    });

    scene.input.on('pointerup', (_: any, gameObject: Phaser.Physics.Arcade.Image) => {
      if (this.player && this.isDragging) {
        this.isDragging = false;
        draggingGraphics.clear();
        const velocityX = draggingIndicator.x1 - draggingIndicator.x2;
        const velocityY = draggingIndicator.y1 - draggingIndicator.y2;

        this.player.setVelocity(velocityX * VELOCITY_FACTOR, velocityY * VELOCITY_FACTOR);
      }
    });
  }

  updateGame(data: object) {
    if (!this.graphics) return;
  }
}

export default GameBoard;
