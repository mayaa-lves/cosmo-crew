import Phaser from 'phaser'

export class LobbyScene extends Phaser.Scene {
    constructor() {
        super('LobbyScene')
    }

    create() {
        // ===== CÂMERA E POSIÇÕES =====

        this.cameras.main.setBackgroundColor('#101a38')

        const centroX = this.cameras.main.centerX
        const centroY = this.cameras.main.centerY

        // ===== FUNDO ESPACIAL =====

        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(
                0,
                this.cameras.main.width,
            )

            const y = Phaser.Math.Between(
                0,
                this.cameras.main.height,
            )

            this.add.circle(
                x,
                y,
                Phaser.Math.Between(1, 3),
                0xffffff,
                Phaser.Math.FloatBetween(0.3, 1),
            )
        }

        // ===== TÍTULO =====

        this.add
            .text(
                centroX,
                centroY - 180,
                'SALA DA TRIPULAÇÃO',
                {
                    fontFamily: 'Arial',
                    fontSize: '42px',
                    fontStyle: 'bold',
                    color: '#ffffff',
                },
            )
            .setOrigin(0.5)

        this.add
            .text(
                centroX,
                centroY - 125,
                'Reúna sua equipe para iniciar a missão.',
                {
                    fontFamily: 'Arial',
                    fontSize: '22px',
                    color: '#a9c7ff',
                },
            )
            .setOrigin(0.5)

        // ===== BOTÃO CRIAR SALA =====

        const botaoCriarSala = this.add
            .rectangle(
                centroX,
                centroY - 25,
                300,
                65,
                0x55d6be,
            )
            .setInteractive({
                useHandCursor: true,
            })

        this.add
            .text(
                centroX,
                centroY - 25,
                'CRIAR SALA',
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    fontStyle: 'bold',
                    color: '#17243b',
                },
            )
            .setOrigin(0.5)

        // ===== BOTÃO ENTRAR EM SALA =====

        const botaoEntrarSala = this.add
            .rectangle(
                centroX,
                centroY + 65,
                300,
                65,
                0x315ee8,
            )
            .setInteractive({
                useHandCursor: true,
            })

        this.add
            .text(
                centroX,
                centroY + 65,
                'ENTRAR EM SALA',
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    fontStyle: 'bold',
                    color: '#ffffff',
                },
            )
            .setOrigin(0.5)

        // ===== MENSAGEM DA SALA =====

        const textoSala = this.add
            .text(
                centroX,
                centroY + 150,
                '',
                {
                    fontFamily: 'Arial',
                    fontSize: '22px',
                    color: '#ffffff',
                    align: 'center',
                },
            )
            .setOrigin(0.5)

        // ===== AÇÃO DE CRIAR SALA =====

        botaoCriarSala.on('pointerdown', () => {
            const codigoSala = Phaser.Utils.String.UUID()
                .slice(0, 5)
                .toUpperCase()

            textoSala.setText([
                `Código da sala: ${codigoSala}`,
                '',
                'Jogadores conectados: 1/4',
                '',
                'A conexão multiplayer será adicionada depois.',
            ])
        })

        // ===== AÇÃO DE ENTRAR NA SALA =====

        botaoEntrarSala.on('pointerdown', () => {
            const codigoDigitado = window.prompt(
                'Digite o código da sala:',
            )

            if (!codigoDigitado) {
                textoSala
                    .setText('Nenhum código foi informado.')
                    .setColor('#ffb3b3')

                return
            }

            textoSala
                .setText([
                    `Entrando na sala: ${codigoDigitado.toUpperCase()}`,
                    '',
                    'A conexão multiplayer será adicionada depois.',
                ])
                .setColor('#ffffff')
        })

        // ===== BOTÃO DE TESTE DO JOGO =====

        const botaoTestar = this.add
            .text(
                centroX,
                this.cameras.main.height - 70,
                'TESTAR MISSÃO',
                {
                    fontFamily: 'Arial',
                    fontSize: '22px',
                    fontStyle: 'bold',
                    color: '#55d6be',
                    backgroundColor: '#17243b',
                    padding: {
                        x: 20,
                        y: 12,
                    },
                },
            )
            .setOrigin(0.5)
            .setInteractive({
                useHandCursor: true,
            })

        botaoTestar.on('pointerdown', () => {
            this.scene.start('GameScene')
        })

        // ===== BOTÃO VOLTAR =====

        const botaoVoltar = this.add
            .text(
                35,
                30,
                '← VOLTAR',
                {
                    fontFamily: 'Arial',
                    fontSize: '20px',
                    color: '#ffffff',
                },
            )
            .setInteractive({
                useHandCursor: true,
            })

        botaoVoltar.on('pointerdown', () => {
            this.scene.start('MenuScene')
        })
    }
}