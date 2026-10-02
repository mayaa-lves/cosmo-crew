import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
    // ===== OBJETOS PRINCIPAIS =====

    private jogador!: Phaser.GameObjects.Arc
    private papel!: Phaser.GameObjects.Rectangle
    private terminal!: Phaser.GameObjects.Rectangle

    // ===== CONTROLES =====

    private cursores!: Phaser.Types.Input.Keyboard.CursorKeys

    private teclasWASD!: {
        W: Phaser.Input.Keyboard.Key
        A: Phaser.Input.Keyboard.Key
        S: Phaser.Input.Keyboard.Key
        D: Phaser.Input.Keyboard.Key
    }

    private teclaInteragir!: Phaser.Input.Keyboard.Key

    // ===== INTERFACE DE INTERAÇÃO =====

    private textoInteracao!: Phaser.GameObjects.Text

    private painelInformacao!: Phaser.GameObjects.Text
    private informacaoAberta = false

    private painelTerminal!: Phaser.GameObjects.Text
    private terminalAberto = false

    private textoResposta!: Phaser.GameObjects.Text
    private respostaDigitada = ''

    private textoResultado!: Phaser.GameObjects.Text

    // ===== CONFIGURAÇÃO DA CENA =====

    constructor() {
        super('GameScene')
    }

    create() {
        // ===== CÂMERA E POSIÇÕES DE REFERÊNCIA =====

        this.cameras.main.setBackgroundColor('#eaf4ff')

        const centroX = this.cameras.main.centerX
        const centroY = this.cameras.main.centerY

        // ===== TÍTULO TEMPORÁRIO =====

        this.add
            .text(centroX, 60, 'COSMO CREW', {
                fontFamily: 'Arial',
                fontSize: '48px',
                color: '#17243b',
            })
            .setOrigin(0.5)

        // ===== CRIAÇÃO DO JOGADOR =====

        this.jogador = this.add.circle(
            centroX,
            centroY + 100,
            30,
            0x55d6be,
        )

        // Mantém o jogador visualmente acima dos objetos do chão.
        this.jogador.setDepth(10)

        // Adiciona um corpo físico ao jogador.
        this.physics.add.existing(this.jogador)

        const corpo =
            this.jogador.body as Phaser.Physics.Arcade.Body

        // Impede que o jogador saia dos limites da tela.
        corpo.setCollideWorldBounds(true)

        // ===== PAREDE DE TESTE =====

        const parede = this.add.rectangle(
            centroX,
            centroY,
            300,
            40,
            0x526277,
        )

        // Transforma a parede em um objeto físico estático.
        this.physics.add.existing(parede, true)

        // Ativa a colisão entre o jogador e a parede.
        this.physics.add.collider(this.jogador, parede)

        // ===== DOCUMENTO CIENTÍFICO =====

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

        // ===== TERMINAL DE CÁLCULO =====

        this.terminal = this.add.rectangle(
            centroX - 350,
            centroY,
            120,
            90,
            0x2e86de,
        )

        this.terminal.setStrokeStyle(4, 0x17243b)

        this.add
            .text(
                this.terminal.x,
                this.terminal.y,
                'PAINEL',
                {
                    fontFamily: 'Arial',
                    fontSize: '20px',
                    fontStyle: 'bold',
                    color: '#ffffff',
                },
            )
            .setOrigin(0.5)
            .setDepth(1)

        // Adiciona um corpo físico estático ao terminal.
        this.physics.add.existing(this.terminal, true)

        const corpoTerminal =
            this.terminal
                .body as Phaser.Physics.Arcade.StaticBody

        // Atualiza o corpo físico usando o tamanho do desenho.
        corpoTerminal.updateFromGameObject()

        // Cria a colisão entre o jogador e o terminal.
        this.physics.add.collider(
            this.jogador,
            this.terminal,
        )

        // ===== JANELA DA TAREFA DO TERMINAL =====

        this.painelTerminal = this.add
            .text(
                centroX,
                centroY,
                [
                    'TERMINAL CIENTÍFICO',
                    '',
                    'Um equipamento possui massa de 10 kg.',
                    '',
                    'Calcule o peso desse equipamento em Marte.',
                    '',
                    'Dica: procure informações pela nave.',
                    '',
                    'Digite a resposta e pressione Enter.',
                    'Pressione E para fechar.',
                ],
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#17243b',
                    align: 'center',
                    backgroundColor: '#ffffff',
                    padding: {
                        x: 40,
                        y: 30,
                    },
                    wordWrap: {
                        width: 600,
                    },
                },
            )
            .setOrigin(0.5)
            .setDepth(30)
            .setVisible(false)

        // ===== CAMPO DE RESPOSTA DO TERMINAL =====

        this.textoResposta = this.add
            .text(
                centroX,
                centroY + 150,
                'Resposta: _',
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#17243b',
                    backgroundColor: '#eaf0ff',
                    padding: {
                        x: 20,
                        y: 12,
                    },
                },
            )
            .setOrigin(0.5)
            .setDepth(31)
            .setVisible(false)

        // ===== RESULTADO DA RESPOSTA =====

        this.textoResultado = this.add
            .text(
                centroX,
                centroY + 215,
                '',
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#17243b',
                    align: 'center',
                },
            )
            .setOrigin(0.5)
            .setDepth(31)
            .setVisible(false)

        // ===== DIGITAÇÃO DA RESPOSTA =====

        this.input.keyboard!.on(
            'keydown',
            (evento: KeyboardEvent) => {
                // Só permite digitar com o terminal aberto.
                if (!this.terminalAberto) {
                    return
                }

                // Permite números.
                if (
                    evento.key >= '0' &&
                    evento.key <= '9'
                ) {
                    this.respostaDigitada += evento.key
                }

                // Permite apenas um separador decimal.
                if (
                    (evento.key === ',' ||
                        evento.key === '.') &&
                    !this.respostaDigitada.includes(',')
                ) {
                    this.respostaDigitada += ','
                }

                // Apaga o último caractere.
                if (evento.key === 'Backspace') {
                    this.respostaDigitada =
                        this.respostaDigitada.slice(0, -1)
                }

                // Confere a resposta ao pressionar Enter.
                if (evento.key === 'Enter') {
                    const respostaNumerica = Number(
                        this.respostaDigitada.replace(
                            ',',
                            '.',
                        ),
                    )

                    if (respostaNumerica === 37.1) {
                        this.textoResultado
                            .setText(
                                'Parabéns! Resposta correta.',
                            )
                            .setColor('#28a745')
                            .setVisible(true)
                    } else {
                        this.textoResultado
                            .setText(
                                'Resposta incorreta. Tente novamente.',
                            )
                            .setColor('#dc3545')
                            .setVisible(true)
                    }
                }

                // Atualiza a resposta mostrada na tela.
                this.textoResposta.setText(
                    `Resposta: ${
                        this.respostaDigitada || '_'
                    }`,
                )
            },
        )

        // ===== CONFIGURAÇÃO DOS CONTROLES =====

        // Cria as teclas direcionais.
        this.cursores =
            this.input.keyboard!.createCursorKeys()

        // Cria as teclas W, A, S e D.
        this.teclasWASD =
            this.input.keyboard!.addKeys(
                'W,A,S,D',
            ) as typeof this.teclasWASD

        // Cria a tecla usada para interagir.
        this.teclaInteragir =
            this.input.keyboard!.addKey(
                Phaser.Input.Keyboard.KeyCodes.E,
            )

        // ===== AVISO DE INTERAÇÃO =====

        this.textoInteracao = this.add
            .text(
                centroX,
                this.cameras.main.height - 70,
                'Pressione E para interagir',
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#17243b',
                    backgroundColor: '#ffffff',
                    padding: {
                        x: 16,
                        y: 10,
                    },
                },
            )
            .setOrigin(0.5)
            .setDepth(20)
            .setVisible(false)

        // ===== PAINEL DO RELATÓRIO =====

        this.painelInformacao = this.add
            .text(
                centroX,
                centroY,
                [
                    'RELATÓRIO CIENTÍFICO',
                    '',
                    'A gravidade de Marte é',
                    'aproximadamente 3,71 m/s².',
                    '',
                    'Guarde esta informação.',
                    'Sua equipe poderá precisar dela.',
                    '',
                    'Pressione E para fechar.',
                ],
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#17243b',
                    align: 'center',
                    backgroundColor: '#ffffff',
                    padding: {
                        x: 40,
                        y: 30,
                    },
                    wordWrap: {
                        width: 600,
                    },
                },
            )
            .setOrigin(0.5)
            .setDepth(30)
            .setVisible(false)
    }

    update() {
        // ===== DADOS DO MOVIMENTO =====

        const corpo =
            this.jogador.body as Phaser.Physics.Arcade.Body

        const velocidade = 220

        // Interrompe a velocidade anterior.
        corpo.setVelocity(0)

        // ===== BLOQUEIO DURANTE A LEITURA =====

        if (this.informacaoAberta) {
            if (
                Phaser.Input.Keyboard.JustDown(
                    this.teclaInteragir,
                )
            ) {
                this.informacaoAberta = false
                this.painelInformacao.setVisible(false)
            }

            return
        }

        // ===== TERMINAL ABERTO =====

        if (this.terminalAberto) {
            if (
                Phaser.Input.Keyboard.JustDown(
                    this.teclaInteragir,
                )
            ) {
                this.terminalAberto = false
                this.painelTerminal.setVisible(false)
                this.textoResposta.setVisible(false)
                this.textoResultado.setVisible(false)
            }

            return
        }

        // ===== MOVIMENTAÇÃO HORIZONTAL =====

        if (
            this.cursores.left.isDown ||
            this.teclasWASD.A.isDown
        ) {
            corpo.setVelocityX(-velocidade)
        }

        if (
            this.cursores.right.isDown ||
            this.teclasWASD.D.isDown
        ) {
            corpo.setVelocityX(velocidade)
        }

        // ===== MOVIMENTAÇÃO VERTICAL =====

        if (
            this.cursores.up.isDown ||
            this.teclasWASD.W.isDown
        ) {
            corpo.setVelocityY(-velocidade)
        }

        if (
            this.cursores.down.isDown ||
            this.teclasWASD.S.isDown
        ) {
            corpo.setVelocityY(velocidade)
        }

        // Mantém a mesma velocidade na diagonal.
        if (corpo.velocity.length() > 0) {
            corpo.velocity
                .normalize()
                .scale(velocidade)
        }

        // ===== PROXIMIDADE DO DOCUMENTO =====

        const distanciaDoPapel =
            Phaser.Math.Distance.Between(
                this.jogador.x,
                this.jogador.y,
                this.papel.x,
                this.papel.y,
            )

        const estaPertoDoPapel =
            distanciaDoPapel <= 90

        // ===== PROXIMIDADE DO TERMINAL =====

        const distanciaDoTerminal =
            Phaser.Math.Distance.Between(
                this.jogador.x,
                this.jogador.y,
                this.terminal.x,
                this.terminal.y,
            )

        const estaPertoDoTerminal =
            distanciaDoTerminal <= 120

        // ===== INTERAÇÃO COM O DOCUMENTO =====

        if (
            estaPertoDoPapel &&
            Phaser.Input.Keyboard.JustDown(
                this.teclaInteragir,
            )
        ) {
            this.informacaoAberta = true
            this.painelInformacao.setVisible(true)
            this.textoInteracao.setVisible(false)
        }

        // ===== INTERAÇÃO COM O TERMINAL =====

        if (
            estaPertoDoTerminal &&
            Phaser.Input.Keyboard.JustDown(
                this.teclaInteragir,
            )
        ) {
            this.terminalAberto = true
            this.respostaDigitada = ''

            this.painelTerminal.setVisible(true)

            this.textoResposta
                .setText('Resposta: _')
                .setVisible(true)

            this.textoResultado
                .setText('')
                .setVisible(false)

            this.textoInteracao.setVisible(false)
        }

        // ===== AVISO DE INTERAÇÃO =====

        if (estaPertoDoPapel) {
            this.textoInteracao
                .setText('Pressione E para ler')
                .setVisible(true)
        } else if (estaPertoDoTerminal) {
            this.textoInteracao
                .setText('Pressione E para acessar')
                .setVisible(true)
        } else {
            this.textoInteracao.setVisible(false)
        }
    }
}