const puzzle = document.getElementById("puzzle");
let gridSize // Tamanho da grade do quebra-cabeça
let imagem = "midia/img/car-oficina.png";

// Esconder o jogo inicialmente
document.getElementById("jogo").style.display = "none"
document.querySelector(".status").style.display = "none"
puzzle.style.display = "none"

// Selecionar imagem para o jogo
let opcImg = document.getElementById("opção");
opcImg.addEventListener("click", selecionarImagem);
function selecionarImagem() {
  opcImg.classList.add("imgEscolhida");
  let imgEscolhida = document.getElementById("imgEscolhida")

  imgEscolhida.style.outline = "3px solid #000000ff";
}



// Iniciar o jogo
let jogo = document.getElementById("jogo");

let iniciar = document.getElementById("startGame");
iniciar.addEventListener("click", telaJogo);
function telaJogo() {
  document.getElementById("pi").style.display = "none";
  document.getElementById("quebraCabeça").style.display = "block";

  puzzle.style.display = "grid";
  document.querySelector(".status").style.display = "block"
  jogo.style.display = "block";

  let dificuldade = document.getElementById("dificuldade");
  console.log("Dificuldade: ", dificuldade.value);

  puzzle.style.gridTemplateColumns = `repeat(${dificuldade.value}, 1fr)`; // Definir colunas da grade com base na dificuldade selecionada
  gridSize = parseInt(dificuldade.value); // Definir tamanho da grade com base na dificuldade selecionada

  criarPeças();
}



// Armazenar a ordem das peças
let ordemIndex = [];
let ordemAtual = [];

// Variáveis de controle
let movimentos = 0;
let tempoRestante; // Tempo em segundos
if (dificuldade.value === "4") {
  tempoRestante = 120; // Tempo para dificuldade 6x6
} else if (dificuldade.value === "6") {
  tempoRestante = 180; // Tempo para dificuldade 8x8
} else if (dificuldade.value === "8") {
  tempoRestante = 300; // Tempo para dificuldade 10x10
}
let intervaloTempo;


// Variáveis para controle de peças selecionadas
let posA = null;
let posB = null;
let cl1 = null;

function criarPeças() {
  // Criar peças do puzzle
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const tile = document.createElement("div"); // Criar elemento da peça
      tile.classList.add("tile"); // Adicionar classe "tile"
      tile.classList.add("jogo"); // Adicionar classe "tile"

      // Calcular posição da imagem
      const posX = (x / (gridSize - 1)) * 100; // Ajuste da posição X
      const posY = (y / (gridSize - 1)) * 100; // Ajuste da posição Y

      // Definir imagem e recorte do fundo
      tile.style.backgroundImage = `url(${imagem})`;
      tile.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`; // Ajuste do tamanho do fundo
      tile.style.backgroundPosition = `${posX}% ${posY}%`; // Ajuste da posição do Fundo

      let posiçãoindex = y * gridSize + x; // Calcular índice de posição
      tile.dataset.posiçãoindex = posiçãoindex; // Atribuir índice de posição

      if (puzzle) {
        puzzle.appendChild(tile); // Adicionar a peça ao quebra-cabeça
      }
      ordemIndex.push(posiçãoindex); // Adicionar índice à ordem atual
    }
  }
}

let embaralhar = document.getElementById("start");
embaralhar.addEventListener("click", iniciarJogo);

function iniciarJogo() {
  movimentos = 0;
  tempoRestante = 120; // reinicia o tempo

  ordemAtual = shuffle(ordemIndex.slice()); // Embaralhar a ordem atual
  atualizarPecas(); // Atualizar peças com base na ordem atual

  clearInterval(intervaloTempo); // garante que não tenha outro contador rodando

  document.querySelectorAll(".tile").forEach((tile) => {
    tile.addEventListener("click", identPeca);// Adicionar evento de clique a cada peça
  });

  function identPeca() {

    const tileClicada = event.target; // Obter a peça clicada
    const indexClicado = [...document.querySelectorAll(".tile")].indexOf(tileClicada);

    if (posA === null) {
      posA = indexClicado;
      cl1 = tileClicada;
      cl1.classList.add("selecionada");

      console.log("Antes:", ordemAtual);

    } else {
      posB = indexClicado;

      if (posA != posB) {
        // o jogador clicou em peças A e B
        console.log("Trocando:", posA, posB);

        let intermediário = ordemAtual[posA];
        ordemAtual[posA] = ordemAtual[posB];
        ordemAtual[posB] = intermediário;

        atualizarPecas(); // Atualizar peças com base na ordem atual

        cl1.classList.remove("selecionada");
        cl1 = null;
        posA = null;
        posB = null;

        console.log("Depois: ", ordemAtual);

        movimentos++;
        document.getElementById("moves").textContent = `Movimentos: ${movimentos}`;

      } else {
        console.log("Mesma peça clicada");
        cl1.classList.remove("selecionada");
        cl1 = null;
        posA = null;
      }
    }
    verificarVitoria();
    function verificarVitoria() {
      // Compara cada elemento dos dois arrays
      const venceu = ordemIndex.every((valor, i) => valor === ordemAtual[i]);

      if (venceu) {
        console.log("🎉 Partida Vencida!");
        alert(`Parabéns! Você montou o carro completo! Em ${movimentos} movimentos e ${120 - tempoRestante} segundos.`);
        encerrarPartida();
      }
    }


  }

  //Em resumo, ele vai criar um quebra-cabeça de 6x6 peças, 
  //onde cada peça exibe uma parte específica da imagem de fundo
  //ajustando o tamanho e a posição do fundo para garantir que cada peça mostre a seção correta da imagem completa.

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5); //Randomizar a ordem dos elementos do array
  }

  // Função para atualizar as peças com base na ordem atual

  function atualizarPecas() {
    const tiles = document.querySelectorAll(".tile"); // Selecionar todas as peças do quebra-cabeça
    tiles.forEach((tile, index) => {
      const posIndex = ordemAtual[index]; // Obter o índice da posição correta

      const x = posIndex % gridSize;// Calcular coordenada X
      const y = Math.floor(posIndex / gridSize);// Calcular coordenada Y

      const posX = (x / (gridSize - 1)) * 100;// Ajuste da posição X
      const posY = (y / (gridSize - 1)) * 100;// Ajuste da posição Y

      tile.style.backgroundPosition = `${posX}% ${posY}%`; // Atualizar a posição do fundo
    });
  }


  intervaloTempo = setInterval(() => {
    tempoRestante--;
    document.getElementById("timer").textContent = `Tempo: ${tempoRestante}s`;

    if (tempoRestante <= 0) {
      clearInterval(intervaloTempo); // parar o cronômetro
      document.getElementById("timer").textContent = "Tempo esgotado!";
      encerrarPartida(); // função que você vai criar para tratar o fim
    }
  }, 1000);

  function encerrarPartida() {
    if (tempoRestante <= 0) {
      alert("⏰ O tempo acabou! Tente novamente.");
    }

    // Desativa os cliques das peças
    document.querySelectorAll(".tile").forEach(tile => {
      tile.removeEventListener("click", identPeca);
    });
  }
}