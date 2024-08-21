import { EventBus } from "../EventBus";
export default class MainGame extends Phaser.Scene {
  private score: any = 0;
  private scoreText: any;
  private timer: any;
  private shakeTimer: any;
  private timerText: any;
  private width: number = 0;
  private height: number = 0;
  private autoCreateTimer: any;
  private images: any[] = [];
  private freeze: boolean = false;
  private timerCount: number = 30;
  private fontStyle: any = {
    fontFamily: 'Arial',
    fontSize: 20,
    color: '#000000',
    fontStyle: 'bold',

  };
  constructor() {
    super('MainGame');

    this.score = 0;
    this.scoreText;
    this.timer = null;
    this.timerText;
    this.shakeTimer;
    this.freeze = false
    this.timerCount = 30
  }

  init() {
    // Fadein camera
    this.cameras.main.fadeIn(500);
  }

  create() {
    const screen = document.getElementsByClassName('layout')
    const width = screen[0].clientWidth
    const height = screen[0].clientHeight
    this.width = width
    this.height = height
    const bgWidth = 1125
    const bgHeight = 2115
    this.add.image(width / 2, height / 2, 'dark').setScale(width / bgWidth, height / bgHeight)
    // 倒计时背景框
    const graphics = this.add.graphics({ x: 50, y: 50 }).setDepth(1000);
    graphics.fillStyle(0xffffff, 0.8);

    graphics.fillRoundedRect(0, 0, 70, 30, 12).setPosition(10, 5);

    graphics.fillStyle(0xff00ff, 1);

    // 倒计时和得分
    this.timerText = this.add.text(45, 20, `${this.timerCount}:00`, this.fontStyle).setOrigin(0.5, 0.5).setDepth(1000);
    this.scoreText = this.add.text(width - 30, 20, `${this.score}`, { ...this.fontStyle, color: '#ffffff' }).setOrigin(0.5, 0.5).setDepth(1000);
    this.scoreText.setShadow(1, 1, '#000000', 2);
    this.add.image(width - 60, 20, 'cat').setScale(0.45, 0.45).setDepth(1000)

    EventBus.emit('current-scene-ready', this);
    // 延时1秒后执行
    setTimeout(() => {
      this.start()
    }, 1000);
  }

  start() {
    this.score = 0;
    this.timer = this.time.addEvent({ delay: this.timerCount * 1000, callback: this.gameOver, callbackScope: this });
    this.autoCreateTimer = setInterval(() => {
      this.autoCreateIcon()
    }, 150);
  }

  reStart() {
    this.freeze = false
    this.timer = this.time.addEvent({ delay: this.timerCount * 1000, callback: this.gameOver, callbackScope: this });
    this.autoCreateTimer = setInterval(() => {
      this.autoCreateIcon()
    }, 150);
  }
  autoCreateIcon() {
    try {
      let iconObj = {
        score: 1,
        speed: 4,
        width: 80,
        type: 'cat'
      }
      const catWidth = 170
      const random = Math.random()

      if (random < 0.95) {
        if (random > 0 && random <= 0.11) {
          iconObj = {
            width: 50,
            score: 1,
            speed: Math.random() + 2.2,
            type: 'cat',
          }
        } else if (random > 0.11 && random <= 0.47) {
          iconObj = {
            width: 75,
            score: 3,
            speed: Math.random() + 2.5,
            type: 'cat',
          }
        } else if (random > 0.47 && random <= 0.84) {
          iconObj = {
            width: 85,
            score: 4,
            speed: Math.random() + 2.5,
            type: 'cat',
          }
        } else {
          iconObj = {
            width: 100,
            score: 6,
            speed: Math.random() + 3,
            type: 'cat',
          }
        }
      } else if (random < 0.98 && random >= 0.95) {
        // 不让同屏出现两个冻结
        if (!this.images.filter(item => { return item.type == 'freeze' }).length) {
          iconObj = {
            width: 60 + Math.random() * 10,
            score: 0,
            speed: Math.random() + 3,
            type: 'freeze',
          }
        }
      } else {
        // 不让同屏出现两个炸弹
        if (!this.images.filter(item => { return item.type == 'boom' }).length) {
          iconObj = {
            width: 60 + Math.random() * 10,
            score: -100,
            speed: Math.random() + 3,
            type: 'boom',
          }
        }

      }

      let iconX = Math.random() * this.width
      if (iconX < iconObj.width / 2) {
        iconX = iconObj.width / 2 + 12
      }
      if (iconX > this.width - iconObj.width / 2) {
        iconX = this.width - iconObj.width / 2 - 12
      }

      let icon;
      if (iconObj.type == 'cat') {
        icon = this.add.image(iconX, 0, 'game-cat').setInteractive().setScale(iconObj.width / catWidth, iconObj.width / catWidth).setDepth(10)
      } else {
        icon = this.add.image(iconX, 0, iconObj.type).setInteractive().setScale(iconObj.width / 200, iconObj.width / 200).setDepth(10)
      }

      this.images.push({
        icon: icon,
        speed: iconObj.speed,
        maxY: this.height + 200,
        type: iconObj.type,
        score: iconObj.score,
      })
      icon.on('pointerdown', () => {
        if (iconObj.type == 'boom') {
          this.shake()
          const scoreTextTween = this.add.text(icon.x, icon.y, `${iconObj.score}`, { fontSize: 24, color: '#ff0000', stroke: '#000000', strokeThickness: 2, fontStyle: 'bold' }).setDepth(10)
          this.add.tween({
            targets: scoreTextTween,
            alpha: { from: 1, to: 0 },
            ease: 'Linear',
            duration: 1000,
          })
          this.score = Math.max(this.score - iconObj.score, 0)
          this.scoreText.setText(this.score).setColor('#ffffff')
          const bgWidth = 1125
          const bgHeight = 2115
          const boomBgImg = this.add.image(this.width / 2, this.height / 2, `${iconObj.type}Bg`).setScale(this.width / bgWidth, this.height / bgHeight);
          setTimeout(() => {
            boomBgImg.destroy()
          }, 1000);
          this.images = this.images.filter((item) => {
            if (Math.abs(item.icon.x - icon.x) < 200 && Math.abs(item.icon.y - icon.y) < 200) {
              item?.icon?.destroy()
              return false
            } else {
              return true
            }
          })
        }
        if (iconObj.type == 'freeze') {
          this.freeze = true
          this.timerCount = Math.round((this.timer.delay - this.timer.elapsed) / 1000)
          this.time.removeEvent(this.timer)
          this.timer = null
          clearInterval(this.autoCreateTimer)
          const bgWidth = 1125
          const bgHeight = 2115
          const boomBgImg = this.add.image(this.width / 2, this.height / 2, `${iconObj.type}Bg`).setScale(this.width / bgWidth, this.height / bgHeight);
          EventBus.emit('execTypeCmd', iconObj.type)
          setTimeout(() => {
            this.reStart()
            boomBgImg.destroy()
            EventBus.emit('execTypeCmd', '')
          }, 4000);
          icon.destroy()
        }
        if (iconObj.type == 'cat') {
          // 找到距离附近的所有cat然后击碎
          this.images = this.images.filter((item) => {
            if (Math.abs(item.icon.x - icon.x) < 50 && Math.abs(item.icon.y - icon.y) < 50 && item.type == 'cat') {
              const scoreTextTween = this.add.text(item.icon.x, item.icon.y, `+${item.score}`, { fontSize: 24, color: '#ffffff', stroke: '#000000', strokeThickness: 2, fontStyle: 'bold' }).setDepth(10)
              this.add.tween({
                targets: scoreTextTween,
                alpha: { from: 1, to: 0 },
                ease: 'Linear',
                duration: 1000,
              })
              item?.icon?.destroy()
              this.score += item?.score
              return false
            } else {
              return true
            }
          })

          this.scoreText.setText(this.score)

          EventBus.emit('execBoom', { left: icon.x, top: icon.y, show: true })
          setTimeout(() => {
            EventBus.emit('execBoom', { left: icon.x, top: icon.y, show: false })
          }, 300);
        }
      })
    } catch {
      clearInterval(this.autoCreateTimer)
    }
  }

  shake() {
    this.cameras.main.shake(100, 0.01);
  }

  update() {
    if (this.timer) {
      if (this.timer.getProgress() === 1) {
        this.timerText.setText('00:00');
        this.time.removeAllEvents()
        this.timer = null
        this.timerCount = 30
        clearInterval(this.autoCreateTimer)
      } else {
        const remaining = (this.timerCount - this.timer.getElapsedSeconds()).toPrecision(4);
        const pos = remaining.indexOf('.');

        let seconds = remaining.substring(0, pos);
        let ms = remaining.substr(pos + 1, 2);

        seconds = Phaser.Utils.String.Pad(seconds, 2, '0', 1);

        this.timerText.setText(seconds + ':' + ms);

        if (!this.freeze) {
          this.images.map((item, index) => {
            item.icon.y += item.speed
            if (item.icon.y > item.maxY) {
              this.images.splice(index, 1)
            }
            if (item.type !== 'cat') {
              item.icon.rotation += Math.random() * 0.05
            }
          })
        }
      }
    }
  }

  async gameOver() {
    this.time.removeAllEvents()
    clearInterval(this.autoCreateTimer)
    this.timer = null
    setTimeout(() => {
      localStorage.setItem('currentScore', this.score)
      this.scene.start('GameOver')
    }, 1000);
  }
}