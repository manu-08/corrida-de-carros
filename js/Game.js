class Jogo {
  constructor() {
    this.tituloReiniciar = createElement("h2");
    this.botaoReiniciar = createButton("");

    this.tituloTabela = createElement("h2");

    this.primeiro = createElement("h2");
    this.segundo = createElement("h2");

    this.jogadorMovendo = false;
    this.setaEsquerdaAtiva = false;
  }

  lerEstado() {
    var refEstadoJogo = database.ref("estadoJogo");
    refEstadoJogo.on("value", function (dados) {
      estadoJogo = dados.val();
    });
  }
  atualizar(num) {
    database.ref("/").update({
      estadoJogo: num
    });
  }

  iniciar() {
    jogador = new Jogador();
    numJogadores = jogador.lerNum();

    form = new Form();
    form.disjogar();

    carro1 = createSprite(width / 2 - 50, height - 100);
    carro1.addImage("car1", imgCarro1);
    carro1.addImage("explosao", explosao)
    carro1.scale = 0.07;

    carro2 = createSprite(width / 2 + 100, height - 100);
    carro2.addImage("car2", imgCarro2);
    carro2.addImage("explosao", explosao)
    carro2.scale = 0.07;

    carros = [carro1, carro2];

    tanques = new Group();
    moedas = new Group();

    obstaculos = new Group();

    var posicoesObstaculos = [
      { x: width / 2 + 250, y: height - 800, image: imgObs2 },
      { x: width / 2 - 150, y: height - 1300, image: imgObs1 },
      { x: width / 2 + 250, y: height - 1800, image: imgObs1 },
      { x: width / 2 - 180, y: height - 2300, image: imgObs2 },
      { x: width / 2, y: height - 2800, image: imgObs2 },
      { x: width / 2 - 180, y: height - 3300, image: imgObs1 },
      { x: width / 2 + 180, y: height - 3300, image: imgObs2 },
      { x: width / 2 + 250, y: height - 3800, image: imgObs2 },
      { x: width / 2 - 150, y: height - 4300, image: imgObs1 },
      { x: width / 2 + 250, y: height - 4800, image: imgObs2 },
      { x: width / 2, y: height - 5300, image: imgObs1 },
      { x: width / 2 - 180, y: height - 5500, image: imgObs2 }
    ];

    // Adicionar sprite de combustível no jogo
    this.adicionarSprites(tanques, 4, imgTanque, 0.02);

    // Adicionar sprite de moeda no jogo
    this.adicionarSprites(moedas, 18, imgMoeda, 0.09);

    //Adicionar sprite de obstáculo no jogo
    this.adicionarSprites(obstaculos, posicoesObstaculos.length, imgObs1, 0.04, posicoesObstaculos);
  }

  adicionarSprites(grupo, numSprites, imgSprite, scale, positions = []) {
    for (var i = 0; i < numSprites; i++) {
      var x, y;

      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        imgSprite = positions[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(-height * 4.5, height - 400);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", imgSprite);

      sprite.scale = scale;
      grupo.add(sprite);
    }
  }

  mudarElementos() {
    form.hide();
    form.tituloImg.position(40, 50);
    form.tituloImg.class("tituloAposEfeito");

    this.tituloReiniciar.html("Reiniciar o Jogo");
    this.tituloReiniciar.class("textoReiniciar");
    this.tituloReiniciar.position(width / 2 + 200, 40);

    this.botaoReiniciar.class("botaoReiniciar");
    this.botaoReiniciar.position(width / 2 + 230, 100);

    this.tituloTabela.html("Placar");
    this.tituloTabela.class("textoReiniciar");
    this.tituloTabela.position(width / 3 - 60, 40);

    this.primeiro.class("textoTabela");
    this.primeiro.position(width / 3 - 50, 80);

    this.segundo.class("textoTabela");
    this.segundo.position(width / 3 - 50, 130);
  }

  jogar() {
    this.mudarElementos();
    this.checarBotaoReiniciar();

    Jogador.lerInfoJogadores();
    jogador.lerCarrosNoFim();

    if (todosJogadores !== undefined) {
      image(pista, 0, -height * 5, width, height * 6);

      this.mostrarVida();
      this.mostrarCombustivel();
      this.mostrarTabela();

      //índice da matriz
      var indice = 0;
      for (var plr in todosJogadores) {
        //adicione 1 ao índice para cada loop
        indice = indice + 1;
        var vida_atual = todosJogadores[plr].vida
        if (vida_atual <= 0) {
          carros[indice - 1].changeImage("explosao")
          carros[indice - 1].scale = 0.3
        }
        //use os dados do banco de dados para exibir os carros nas direções x e y
        var x = todosJogadores[plr].posX;
        var y = height - todosJogadores[plr].posY;

        carros[indice - 1].position.x = x;
        carros[indice - 1].position.y = y;

        if (indice === jogador.indice) {
          stroke(10);
          fill("red");
          ellipse(x, y, 60, 60);

          this.controlarCombustivel(indice);
          this.controlarMoedas(indice);
          this.colisaoComObstaculos(indice);
          this.colisaoComCarro(indice)

          //alterar a posição da câmera na direção y
          camera.position.y = carros[indice - 1].position.y;
        }
      }

      //manipulando eventos de teclado
      this.controleJogador();

      const chegada = height * 6 - 100;
      if (jogador.posY > chegada) {
        estadoJogo = 2;
        jogador.classificacao += 1;
        Jogador.atualizarCarrosNoFim(jogador.classificacao);
        jogador.atualizar();
        this.mostrarClassificacao();
      }

      drawSprites();
    }
  }

  checarBotaoReiniciar() {
    this.botaoReiniciar.mousePressed(() => {
      database.ref("/").set({
        numJogadores: 0,
        estadoJogo: 0,
        jogadores: {},
        carrosNoFim: 0
      });
      window.location.reload();
    });
  }

  mostrarTabela() {
    var primeiro, segundo;
    var jogadores = Object.values(todosJogadores);
    if (
      (jogadores[0].classificacao === 0 && jogadores[1].classificacao === 0) ||
      jogadores[0].classificacao === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      primeiro =
        jogadores[0].classificacao +
        "&emsp;" +
        jogadores[0].nome +
        "&emsp;" +
        jogadores[0].pontos;

      segundo =
        jogadores[1].classificacao +
        "&emsp;" +
        jogadores[1].nome +
        "&emsp;" +
        jogadores[1].pontos;
    }

    if (jogadores[1].classificacao === 1) {
      primeiro =
        jogadores[1].classificacao +
        "&emsp;" +
        jogadores[1].nome +
        "&emsp;" +
        jogadores[1].pontos;

      segundo =
        jogadores[0].classificacao +
        "&emsp;" +
        jogadores[0].nome +
        "&emsp;" +
        jogadores[0].pontos;
    }

    this.primeiro.html(primeiro);
    this.segundo.html(segundo);
  }

  mostrarClassificacao() {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${jogador.classificacao}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  controleJogador() {
    if (keyIsDown(UP_ARROW)) {
      this.jogadorMovendo = true;
      jogador.posY += 10;
      jogador.atualizar();
    }

    if (keyIsDown(LEFT_ARROW) && jogador.posX > width / 3 - 50) {
      this.setaEsquerdaAtiva = true;
      jogador.posX -= 5;
      jogador.atualizar();
    }

    if (keyIsDown(RIGHT_ARROW) && jogador.posX < width / 2 + 300) {
      this.setaEsquerdaAtiva = false;
      jogador.posX += 5;
      jogador.atualizar();
    }
  }

  controlarCombustivel(indice) {
    //adicionando combustível
    carros[indice - 1].overlap(tanques, function (coletor, coletado) {
      jogador.combustivel = 185;
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      coletado.remove();
    });
    // NOVO
    if (jogador.combustivel > 0 && this.jogadorMovendo) {
      jogador.combustivel -= 0.3;
    }
    if (jogador.combustivel <= 0) {
      estadoJogo = 2;
      this.fimDoJogo();
    }

  }

  controlarMoedas(indice) {
    carros[indice - 1].overlap(moedas, function (coletor, coletado) {
      jogador.pontos += 21;
      jogador.atualizar();
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      coletado.remove();
    });
  }

  mostrarVida() {
    push();
    image(imgVida, width / 2 - 130, height - jogador.posY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - jogador.posY - 350, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - jogador.posY - 350, jogador.vida, 20);
    noStroke();
    pop();
  }

  mostrarCombustivel() {
    push();
    image(imgTanque, width / 2 - 130, height - jogador.posY - 300, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - jogador.posY - 300, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - jogador.posY - 300, jogador.combustivel, 20);
    noStroke();
    pop();
  }

  fimDoJogo() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }

  colisaoComObstaculos(indice) {
    if (carros[indice - 1].collide(obstaculos)) {

      if (this.setaEsquerdaAtiva) {//novo
        jogador.posX -= 100;
      } else {
        jogador.posX += 100;
      }

      if (jogador.vida > 0) {
        jogador.vida -= 185 / 4;
      }

      jogador.atualizar();
    }
  }
  colisaoComCarro(indice) {
    if (indice === 1) {
      
    if (carros[indice - 1].collide(carros[1])) {

      if (this.setaEsquerdaAtiva) {//novo
        jogador.posX -= 100;
      } else {
        jogador.posX += 100;
      }

      if (jogador.vida > 0) {
        jogador.vida -= 185 / 4;
      }

      jogador.atualizar();
    }
    }
    if (indice === 2) {
      
    if (carros[indice - 1].collide(carros[0])) {

      if (this.setaEsquerdaAtiva) {//novo
        jogador.posX -= 100;
      } else {
        jogador.posX += 100;
      }

      if (jogador.vida > 0) {
        jogador.vida -= 185 / 4;
      }

      jogador.atualizar();
    }
    }
  }
}