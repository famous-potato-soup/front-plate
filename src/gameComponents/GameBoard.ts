import Phaser from "phaser";

import { SocketNameSpace } from "../components/tsx/ReadyComponent";
import { isNullLiteralTypeAnnotation } from "@babel/types";

const MARGIN_OF_MAP = 0;
const MARGIN_OF_BORDER = 0;
const ZOOME_LEVEL_OF_CAMERA = 1.85;
const VELOCITY_FACTOR = 0.15;
const FRICTION_AIR = 0.08;
const BOUND_RATE = 2;

const DRAG_LINE_COLOR = 0x000000;
let hello = [];

export interface GameBoardOptions {
  autoFocus: boolean;

  width: number;
  height: number;

  parent?: string;
}
const cookieData = decodeURIComponent(document.cookie.split(";")[2]);

const email = cookieData.slice(
  cookieData.lastIndexOf("email") + 8,
  cookieData.indexOf("picture") - 3
);
class GameBoard {
  private options: GameBoardOptions;

  public game?: Phaser.Game;
  private graphics?: Phaser.GameObjects.Graphics;
  private player?: Phaser.Physics.Matter.Image;

  private otherPlayers: any = [];
  constructor(options: GameBoardOptions) {
    this.options = options;

    this.setPhaserObjects();

    // SocketNameSpace.on("gameReady", obj => {
    //   this.otherPlayers = obj.user;
    //   hello = obj.user;
    //   this.setPhaserObjects();
    // });
    // SocketNameSpace.on("roomjoined", obj => console.log(obj));
    // SocketNameSpace.on("canShoot", obj => console.log(obj));
  }

  setPhaserObjects() {
    const { autoFocus, width, height, parent } = this.options;

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
        expandParent: true
      },
      physics: {
        default: "matter"
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
          otherPlayers: []
        }
      }
    });
  }

  preloadGameAssets() {
    /**
     * CAUTION: "this" does not mean GameBoard class.
     * This method is not binded to this class.
     */
    const scene: Phaser.Scene = (this as any) as Phaser.Scene;
    scene.load.image("background-tile", "/static/in-game/background.png");
    scene.load.image("player-black", "/static/in-game/player.png");
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

    SocketNameSpace.on("shoot", data => {
      // TODO: data 에서 쏜 돌을 찾앙되는데.....abs
      // otherplayer .
      console.log(this.otherPlayers);
      console.log(data);

      console.log(email);
      this.otherPlayers.forEach(x => console.log(x.email));
      console.log(data.actorEmail);
      this.otherPlayers
        .filter(x => x.email != data.actorEmail)
        .filter(x => data.actorEmail == x.email)
        .forEach(x => {
          // x == other.player
          debugger;
          // x.setVelocity(x.x, x.y);
        });
    });

    SocketNameSpace.on("gameReady", obj => {
      console.log(obj);
      this.otherPlayers = obj.user;
      this.otherPlayers.forEach(item => {
        console.log("myInfo", cookieData);
        if (item.email === email) {
          this.player!.setPosition(item.stones[0].x, item.stones[0].y);
        } else {
          this.createPlayer(scene, item.stones[0].x, item.stones[0].y);
        }
        // document.getElementById('id').css("display", "hidden")
      });
    });
    SocketNameSpace.on("roomjoined", obj => console.log(obj));
    // SocketNameSpace.on("canShoot", obj => console.log(obj));

    scene.matter.world.on("collisionstart", (event: any) => {
      if (event.pairs[0].bodyA.isStatic || event.pairs[0].bodyB.isStatic) {
        console.log("Game Over");
        console.log(this.player);

        SocketNameSpace.emit("GameOver", this.player);
      }
    });
    SocketNameSpace.on("gamefinish", obj => {
      if (obj.result !== undefined) {
        // myInfo.result = obj.result
      }
    });
  }

  setWorldBoundsAndCamera(scene: Phaser.Scene) {
    scene.matter.world.setBounds();
    scene.cameras.main.setZoom(ZOOME_LEVEL_OF_CAMERA);
  }

  setBackgrounds(scene: Phaser.Scene) {
    scene.add
      .tileSprite(
        -MARGIN_OF_MAP,
        -MARGIN_OF_MAP,
        scene.scale.width + MARGIN_OF_MAP * 2,
        scene.scale.height + MARGIN_OF_MAP * 2,
        "background-tile"
      )
      .setOrigin(0);
    scene.cameras.main.setBackgroundColor(0xffffff);
  }

  drawBackgroundBorder(scene: Phaser.Scene) {
    const backgroundGraphics = scene.add.graphics();

    backgroundGraphics.lineStyle(10, 0x000000, 1);
    backgroundGraphics.moveTo(MARGIN_OF_BORDER, MARGIN_OF_BORDER);
    backgroundGraphics.lineTo(
      scene.scale.width - MARGIN_OF_BORDER,
      MARGIN_OF_BORDER
    );
    backgroundGraphics.lineTo(
      scene.scale.width - MARGIN_OF_BORDER,
      scene.scale.height - MARGIN_OF_BORDER
    );
    backgroundGraphics.lineTo(
      MARGIN_OF_BORDER,
      scene.scale.height - MARGIN_OF_BORDER
    );
    backgroundGraphics.lineTo(MARGIN_OF_BORDER, MARGIN_OF_BORDER);
    backgroundGraphics.stroke();
  }

  setPlayer(scene: Phaser.Scene): Phaser.Physics.Matter.Image {
    // let players = [];
    // const self = this;
    // hello.forEach(item => {
    //   console.log("----item");
    //   console.log(item);
    //   const _x = item["stones"][0]["x"];
    //   const _y = item["stones"][0]["y"];
    //   self.createPlayer(scene, _x, _y);
    // });

    // sudo code
    // this.player= players.filter(item=> item.email=== myInfo.email)

    this.player = this.createPlayer(scene, 100, 100);
    scene.cameras.main.startFollow(this.player, true);
    // 다른 플에이어들 생성하기 위해
    return this.player;
  }

  createPlayer(
    scene: Phaser.Scene,
    x: number,
    y: number
  ): Phaser.Physics.Matter.Image {
    const player = scene.matter.add.image(x, y, "player-black");
    player.setCircle(player.width / 2, {});
    player.setBounce(BOUND_RATE);
    player.setFrictionAir(FRICTION_AIR);
    player.setIgnoreGravity(true);

    return player;
  }

  addDragEventListener(scene: Phaser.Scene) {
    const draggingIndicator = new Phaser.Geom.Line();
    const draggingGraphics = scene.add.graphics();

    scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.player) draggingGraphics.clear();
      draggingGraphics.lineStyle(1, DRAG_LINE_COLOR, 1);

      if (this.player) {
        draggingIndicator.setTo(
          this.player.x,
          this.player.y,
          pointer.worldX,
          pointer.worldY
        );
      }

      draggingGraphics.strokeLineShape(draggingIndicator);
    });

    scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        draggingIndicator.x2 = pointer.worldX;
        draggingIndicator.y2 = pointer.worldY;

        draggingGraphics.clear();
        draggingGraphics.lineStyle(1, DRAG_LINE_COLOR, 1);
        draggingGraphics.strokeLineShape(draggingIndicator);
      }
    });

    scene.input.on(
      "pointerup",
      (_: any, gameObject: Phaser.Physics.Arcade.Image) => {
        draggingGraphics.clear();
        const velocityX = draggingIndicator.x1 - draggingIndicator.x2;
        const velocityY = draggingIndicator.y1 - draggingIndicator.y2;

        if (this.player) {
          // shoot
          console.log("shoot");
          const shootData = {
            velecityX: velocityX,
            velocityY: velocityY,
            playerX: this.player.x,
            playerY: this.player.y
          };

          // this.player 찾을 수 있는 정보

          SocketNameSpace.emit("shoot", {
            actorEmail: email,
            velocity: shootData
          });

          this.player.setVelocity(
            velocityX * VELOCITY_FACTOR,
            velocityY * VELOCITY_FACTOR
          );
        }
      }
    );
  }

  updateGame(data: object) {
    if (!this.graphics) return;
  }
}

export default GameBoard;
