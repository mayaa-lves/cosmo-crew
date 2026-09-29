import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
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
  private painelTerminal!: Phaser.GameObjects.Text
  private terminalAberto = false
  private informacaoAberta = false

  // ===== CONFIGURAÇÃO DA CENA =====

  constructor() {
    super('BootScene')
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

    const corpo = this.jogador.body as Phaser.Physics.Arcade.Body

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

    // O valor true transforma a parede em um objeto estático.
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

    // TERMINAL 
    this.terminal = this.add.rectangle(
        centroX - 350,
        centroY,
        120,
        90,
        0x2e86de,
    )

    this.terminal.setStrokeStyle(4, 0x17243b)

    this.add
        .text(this.terminal.x, this.terminal.y, 'PAINEL', {
            fontFamily: 'Arial',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#fff',
        })
        .setOrigin(0.5)
        .setDepth(1)

        // adiciona um corpo fisico estatico ao terminal
        this.physics.add.existing(this.terminal, true)

        const corpoTerminal = 
            this.terminal.body as Phaser.Physics.Arcade.StaticBody

            // atualiza o corpo fisico usando o tamnho e a posição do desenho
            corpoTerminal.updateFromGameObject()

            // cria a colisão entre o jogador e o terminal.
            this.physics.add.collider(this.jogador, this.terminal)

        // janela da tarefa do terminal
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
                'Dica: procure as informações espalhadas pela nave.',
                '',
                'Pressione E para fechar',
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


    // ===== CONFIGURAÇÃO DOS CONTROLES =====

    // Cria as teclas direcionais.
    this.cursores = this.input.keyboard!.createCursorKeys()

    // Cria as teclas W, A, S e D.
    this.teclasWASD = this.input.keyboard!.addKeys(
      'W,A,S,D',
    ) as typeof this.teclasWASD

    // Cria a tecla usada para interagir com objetos.
    this.teclaInteragir = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.E,
    )

    // ===== AVISO DE INTERAÇÃO =====

    this.textoInteracao = this.add
      .text(
        centroX,
        this.cameras.main.height - 70,
        'Pressione E para ler',
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
          'A gravidade de Marte é aproximadamente 3,71 m/s².',
          '',
          'Guarde esta informação.',
          'Sua equipe poderá precisar dela.',
          '',
          'Pressione E para fechar',
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

    const corpo = this.jogador.body as Phaser.Physics.Arcade.Body
    const velocidade = 220

    // Interrompe a velocidade anterior antes de ler as teclas.
    corpo.setVelocity(0)

    // ===== BLOQUEIO DURANTE A LEITURA =====

    if (this.informacaoAberta) {
      if (Phaser.Input.Keyboard.JustDown(this.teclaInteragir)) {
        this.informacaoAberta = false
        this.painelInformacao.setVisible(false)
      }

      // Impede que o restante do update seja executado.
      return
    }

    // ===== TERMINAL ABERTO =====

    if (this.terminalAberto) {
        if (Phaser.Input.Keyboard.JustDown(this.teclaInteragir)) {
            this.terminalAberto = false
            this.painelTerminal.setVisible(false)
        }

        return
    } 

    // ===== MOVIMENTAÇÃO HORIZONTAL =====

    if (this.cursores.left.isDown || this.teclasWASD.A.isDown) {
      corpo.setVelocityX(-velocidade)
    }

    if (this.cursores.right.isDown || this.teclasWASD.D.isDown) {
      corpo.setVelocityX(velocidade)
    }

    // ===== MOVIMENTAÇÃO VERTICAL =====

    if (this.cursores.up.isDown || this.teclasWASD.W.isDown) {
      corpo.setVelocityY(-velocidade)
    }

    if (this.cursores.down.isDown || this.teclasWASD.S.isDown) {
      corpo.setVelocityY(velocidade)
    }

    // Mantém a mesma velocidade durante o movimento diagonal.
    if (corpo.velocity.length() > 0) {
      corpo.velocity.normalize().scale(velocidade)
    }

    // ===== DETECÇÃO DE PROXIMIDADE =====

    const distanciaDoPapel = Phaser.Math.Distance.Between(
      this.jogador.x,
      this.jogador.y,
      this.papel.x,
      this.papel.y,
    )

    const estaPertoDoPapel = distanciaDoPapel <= 90

    // ===== PROXIMIDADE DO TERMINAL =====

    const distanciaDoTerminal = Phaser.Math.Distance.Between(
        this.jogador.x,
        this.jogador.y,
        this.terminal.x,
        this.terminal.y,
    )

    const estaPertoDoTerminal = distanciaDoTerminal <= 120  

    // ===== INTERAÇÃO COM O DOCUMENTO =====

    if (
      estaPertoDoPapel &&
      Phaser.Input.Keyboard.JustDown(this.teclaInteragir)
    ) {
      this.informacaoAberta = true
      this.painelInformacao.setVisible(true)
    }

    // Fecha o relatório caso o jogador seja afastado por outra mecânica.
    if (!estaPertoDoPapel && this.informacaoAberta) {
      this.informacaoAberta = false
      this.painelInformacao.setVisible(false)
    }

    // Mostra o aviso somente quando for possível interagir.
    // ===== AVISO DE INTERAÇÃO =====

    if (estaPertoDoPapel) {
        this.textoInteracao.setText('Pressione E para ler')
        this.textoInteracao.setVisible(true)
    } else if (estaPertoDoTerminal) {
        this.textoInteracao.setText('Pressione E para acessar')
        this.textoInteracao.setVisible(true)
    } else {
        this.textoInteracao.setVisible(false)
    }

    // ===== INTERAÇÃO COM O TERMINAL =====

    if (
        estaPertoDoTerminal &&
        Phaser.Input.Keyboard.JustDown(this.teclaInteragir)
    ) {
        this.terminalAberto = true
        this.painelTerminal.setVisible(true)
}
  }
}