import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
    private jogador!: Phaser.GameObjects.Arc
    private cursores!: Phaser.Types.Input.Keyboard.CursorKeys

    private teclasWASD!: {
        W: Phaser.Input.Keyboard.Key
        A: Phaser.Input.Keyboard.Key
        S: Phaser.Input.Keyboard.Key
        D: Phaser.Input.Keyboard.Key
    }

    private papel!: Phaser.GameObjects.Rectangle


    constructor() {
        super('BootScene')
    }

    create() {
        this.cameras.main.setBackgroundColor('#eaf4ff')

        const centroX = this.cameras.main.centerX
        const centroY = this.cameras.main.centerY

        this.add
            .text(centroX, 60, 'COSMO CREW', {
                fontFamily: 'Arial',
                fontSize: '48px',
                color: '#17243b',
            })
            .setOrigin(0.5)

        this.jogador = this.add.circle(
            centroX,
            centroY + 100,
            30,
            0x55d6be,
        )

        const parede = this.add.rectangle(
            centroX,
            centroY,
            300,
            40,
            0x526277,
        )

        this.papel = this.add.rectangle(
            centroX + 350,
            centroY,
            55,
            40,
            0xfff4cc,
        )

        this.papel.setStrokeStyle(3, 0xd6a84b)

        this.add
            .text(this.papel.x, this.papel.y, '?', {
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#17243b',
            })
            .setOrigin(0.5)

        this.physics.add.existing(parede, true)
        this.physics.add.collider(this.jogador, parede)

        this.physics.add.existing(this.jogador)

        const corpo = this.jogador.body as Phaser.Physics.Arcade.Body
        corpo.setCollideWorldBounds(true)

        this.cursores = this.input.keyboard!.createCursorKeys()

        this.teclasWASD = this.input.keyboard!.addKeys(
            'W,A,S,D',
        ) as typeof this.teclasWASD
    }

    update() {
        const corpo = this.jogador.body as Phaser.Physics.Arcade.Body
        const velocidade = 220

        corpo.setVelocity(0)

        if (this.cursores.left.isDown || this.teclasWASD.A.isDown) {
        corpo.setVelocityX(-velocidade)
        }

        if (this.cursores.right.isDown || this.teclasWASD.D.isDown) {
        corpo.setVelocityX(velocidade)
        }

        if (this.cursores.up.isDown || this.teclasWASD.W.isDown) {
        corpo.setVelocityY(-velocidade)
        }

        if (this.cursores.down.isDown || this.teclasWASD.S.isDown) {
        corpo.setVelocityY(velocidade)
        }

        if (corpo.velocity.length() > 0) {
            corpo.velocity.normalize().scale(velocidade)
        }
    }
}