class Form {
  constructor() {
    this.entrada = createInput("").attribute("placeholder", "Digite Seu Nome");
    this.botao = createButton("Jogar");
    this.tituloImg = createImg("./assets/TITULO.png", "game title");
    this.mensagem = createElement("h2");
  }

  setElementsPosition() {
    this.tituloImg.position(120, 50);
    this.entrada.position(width / 2 - 110, height / 2 - 80);
    this.botao.position(width / 2 - 90, height / 2 - 20);
    this.mensagem.position(width / 2 - 300, height / 2 - 100);
  }

  setElementsStyle() {
    this.tituloImg.class("titulo");
    this.entrada.class("entrada");
    this.botao.class("botao");
    this.mensagem.class("mensagem");
  }

  hide() {
    this.mensagem.hide();
    this.botao.hide();
    this.entrada.hide();
  }

  handleMousePressed() {
    this.botao.mousePressed(() => {
      this.entrada.hide();
      this.botao.hide();
      var ola = `
      Olá ${this.entrada.value()}
      </br>espere o outro jogador entrar...`;
      this.mensagem.html(ola);
      numJogadores += 1;
      jogador.nome = this.entrada.value();
      jogador.indice = numJogadores;
      jogador.adicionarJogador();
      jogador.atualizarNum(numJogadores);
      jogador.lerDistancia();
    });
  }

  disjogar() {
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleMousePressed();
  }
}