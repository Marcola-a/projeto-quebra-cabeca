const puzzle = document.getElementById("puzzle");
const gridSize = 6; // 6x6
let imagem = "../midia/img/car-oficina.png";
let ordemIndex = [];
let ordemAtual = [];
let posA = null;
let posB = null;

// Criar peças do puzzle
for (let y = 0; y < gridSize; y++) {
  for (let x = 0; x < gridSize; x++) {
    const tile = document.createElement("div"); // Criar elemento da peça
    tile.classList.add("tile"); // Adicionar classe "tile"

    // Calcular posição da imagem
    const posX = (x / (gridSize - 1)) * 100; // Ajuste da posição X
    const posY = (y / (gridSize - 1)) * 100; // Ajuste da posição Y

    // Definir imagem e recorte do fundo
    tile.style.backgroundImage = `url(${imagem})`;
    tile.style.backgroundSize = `${gridSize * 100}% ${gridSize * 100}%`; // Ajuste do tamanho do fundo
    tile.style.backgroundPosition = `${posX}% ${posY}%`; // Ajuste da posição do Fundo

    let posiçãoindex = y * gridSize + x; // Calcular índice de posição
    tile.dataset.posiçãoindex = posiçãoindex; // Atribuir índice de posição

    puzzle.appendChild(tile); // Adicionar a peça ao quebra-cabeça

    tile.addEventListener("click", identPeca); // Adicionar evento de clique

    const idPeca = tile.dataset.posiçãoindex // Obter ID da peça

    ordemIndex.push(posiçãoindex); // Adicionar índice à ordem atual
    ordemAtual = shuffle(ordemIndex.slice()); // Embaralhar a ordem atual
    atualizarPecas(); // Atualizar peças com base na ordem atual


    function identPeca() {
      if (posA === null) {
        posA = idPeca;
      } else {
        posB = idPeca;
        // o jogador clicou em peças A e B
        let intermediário = ordemAtual[posA];
        ordemAtual[posA] = ordemAtual[posB];
        ordemAtual[posB] = intermediário;

        console.log(ordemAtual);
        atualizarPecas(); // Atualizar peças com base na ordem atual

        posA = null;
        posB = null;
      }
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
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile, index) => {
    const posIndex = ordemAtual[index];
    const x = posIndex % gridSize;
    const y = Math.floor(posIndex / gridSize);
    const posX = (x / (gridSize - 1)) * 100;
    const posY = (y / (gridSize - 1)) * 100;
    tile.style.backgroundPosition = `${posX}% ${posY}%`;
  });
}


