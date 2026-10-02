import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene')
    }

    create() {
        // === CAMERA E POSIÇÕES === 
        this.cameras.main.setBackgroundColor('#101a38')

        const centroX = this.cameras.main.centerX
        const centroY = this.cameras.main.centerY

        // === FUNDO ESPACIAL TEMPORARIO ===

            // cria pequenas estrelas em posições aleatórias
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width,)
            const y = Phaser.Math.Between(0, this.cameras.main.height,)
            const tamanho = Phaser.Math.Between(1,3)

            this.add.circle(x, y, tamanho, 0xffffff, Phaser.Math.FloatBetween(0.3, 1),)
        }

        // === TITULO DO JOGO ===
        this.add
            .text(centroX, centroY -130, 'COSMO CREW', {
                fontFamily: 'Arial',
                fontSize: '64px',
                fontStyle: 'bold',
                color: '#ffffff',
                stroke: '#315ee8',
                strokeThickness: 6,
            },)
            .setOrigin(0.5)

        // === FRASE PRINCIPAL ===
        this.add
            .text(centroX, centroY - 55, 'Ninguém consegue vencer sozinho.', { 
                fontFamily: 'Arial',
                fontSize: '24px',
                color: '#a9c7ff',
            },)
            .setOrigin(0.5)

        // === BOTÃO JOGAR ===
        const botaoJogar = this.add
            .rectangle(centroX, centroY + 70, 250, 70, 0x55d6be,)
            .setStrokeStyle(4, 0xffffff)
            .setInteractive({ useHandCursor: true})

        const textoBotao = this.add
            .text(centroX, centroY + 70, 'JOGAR', {
                fontFamily: 'Arial',
                fontSize: '32px',
                fontStyle: 'bold',
                color: '#17243b',
            },)
            .setOrigin(0.5)
            
        
        // == EFEITO AO PASSAR O MOUSE ===
        botaoJogar.on('pointerover', () => {
            botaoJogar.setFillStyle(0x3c9e8f)
            botaoJogar.setScale(1.05)
            textoBotao.setScale(1.05)
        })

        botaoJogar.on('pointerout', () => {
            botaoJogar.setFillStyle(0x55d6be)
            botaoJogar.setScale(1)
            textoBotao.setScale(1)
        })

        // === INICIAR O JOGO AO CLICAR NO BOTÃO ===
        botaoJogar.on('pointerdown', () => {
            this.scene.start('LobbyScene')
        })
    }
}