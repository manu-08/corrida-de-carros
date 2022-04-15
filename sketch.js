var canvas;
var fundo, imgCarro1, imgCarro2, pista;
var imgTanque, imgMoeda, imgVida;
var imgObs1, imgObs2;
var database, estadoJogo;
var form, jogador, jogo, numJogadores;
var todosJogadores, carro1, carro2, tanques, moedas, obstaculos;
var carros = [];
var explosao;

function preload() {
  fundo = loadImage("./assets/planodefundo.png");
  imgCarro1 = loadImage("./assets/car1.png");
  imgCarro2 = loadImage("./assets/car2.png");
  pista = loadImage("./assets/pista.png");
  imgTanque = loadImage("./assets/fuel.png");
  imgMoeda = loadImage("./assets/goldCoin.png");
  imgObs1 = loadImage("./assets/obstacle1.png");
  imgObs2 = loadImage("./assets/obstacle2.png");
  imgVida = loadImage("./assets/life.png");
  explosao = loadImage("./assets/blast.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  jogo = new Jogo();
  jogo.lerEstado();
  jogo.iniciar();
}

function draw() {
  background(fundo);
  if (numJogadores === 2) {
    jogo.atualizar(1);
  }

  if (estadoJogo === 1) {
    jogo.jogar();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}