class Jogador {
  constructor() {
    this.nome = null;
    this.indice = null;
    this.posX = 0;
    this.posY = 0;
    this.classificacao = 0;
    this.combustivel = 185;
    this.pontos = 0;
    this.vida = 185;
  }

  adicionarJogador() {
    var jogadorIndice = "jogadores/jogador" + this.indice;

    if (this.indice === 1) {
      this.posX = width / 2 - 100;
    } else {
      this.posX = width / 2 + 100;
    }

    database.ref(jogadorIndice).set({
      nome: this.nome,
      posX: this.posX,
      posY: this.posY,
      classificacao: this.classificacao,
      pontos: this.pontos
    });
  }

  lerDistancia() {
    var refDistancia = database.ref("jogadores/jogador" + this.indice);
    refDistancia.on("value", dados => {
      var dados = dados.val();
      this.posX = dados.posX;
      this.posY = dados.posY;
    });
  }

  lerNum() {
    var numJogadoresRef = database.ref("numJogadores");
    numJogadoresRef.on("value", dados => {
      numJogadores = dados.val();
    });
  }

  atualizarNum(num) {
    database.ref("/").update({
      numJogadores: num
    });
  }

  atualizar() {
    var jogadorIndex = "jogadores/jogador" + this.indice;
    database.ref(jogadorIndex).update({
      posX: this.posX,
      posY: this.posY,
      classificacao: this.classificacao,
      pontos: this.pontos
    });
  }

  static lerInfoJogadores() {
    var refInfoJogadores = database.ref("jogadores");
    refInfoJogadores.on("value", dados => {
      todosJogadores = dados.val();
    });
  }

  lerCarrosNoFim() {
    database.ref('carrosNoFim').on('value', (dados) => {
      this.classificacao = dados.val();
    });
  }

  static atualizarCarrosNoFim(num) {
    database.ref("/").update({
      carrosNoFim: num
    });
  }
}