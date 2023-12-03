const gridUI = document.querySelector('.game-board')
const xButton = document.getElementById('x-button')
const oButton = document.getElementById('o-button')
const restartButton = document.getElementById('restart-button')
const resultContainer = document.getElementById('result-container')
let gameFinished = false
let turnCount = 0

function createPlayer(name, symbol) {
  this.name = name;
  this.symbol = symbol;
  const viewSymbol = () => symbol;
  function updateSymbol(a) {
    symbol = a;
    screenController.loadBoardToDOM();
    gameBoard.resetGrid();
  }
  return { updateSymbol, viewSymbol}
}

const gameBoard = (function () {
  let grid = [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
  const displayBoard = () => grid;
  const displaySquare = (a) => grid[a];
  const updateBoard = (symbol, a) => grid[a] = symbol;
  const resetGrid = () => grid = [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
  return  { displayBoard, updateBoard, displaySquare, resetGrid };
})();

const gameController = (function () {

  restartButton.addEventListener("click", () => {
    gameBoard.resetGrid();
    screenController.loadBoardToDOM()
    gameFinished = false;
    turnCount = 0
    screenController.clearOutcome()
  })

  oButton.addEventListener("click", () => {
    player.updateSymbol(0);
    computer.updateSymbol(1);
    gameFinished = false;
    turnCount = 0
    oButton.classList.add('selected')
    xButton.classList.remove('selected')
    screenController.clearOutcome()
  })

  xButton.addEventListener("click", () => {
    player.updateSymbol(1);
    computer.updateSymbol(0);
    gameFinished = false;
    turnCount = 0
    xButton.classList.add('selected')
    oButton.classList.remove('selected')
    screenController.clearOutcome()
  })

  function completePlayersTurn(square) {
    if ( gameFinished == true ) {
      return;
    } else if (checkSquareIsEmpty(square) == false) {
      return;
    } else {
      // update the grid array and grid UI
      gameBoard.updateBoard(player.viewSymbol(), square);
      screenController.updateBoardDOM(player.viewSymbol(), square);

      // check for a win before the computer's turn
      if (checkForWin(gameBoard.displayBoard()) == true) {
        screenController.displayOutcome("Player wins!");
        gameFinished = true;
      } else {
        // check for a draw before the computer's turn
        turnCount++;
        if (checkForDraw() == true) {
          screenController.displayOutcome("Draw!")
          gameFinished = true;
        } else {
          completeComputersTurn();
        }
      }
    }
  }

  function completeComputersTurn() {
    let empty = false
    let square = undefined

    // make sure the computer's turn is in an empty grid square
    while (empty == false) {
      square = getRandomSquare();
      if (checkSquareIsEmpty(square) != false) {
        empty = true;
      }
    }

    // update the grid array and grid UI
    gameBoard.updateBoard(computer.viewSymbol(), square)
    screenController.updateBoardDOM(computer.viewSymbol(),square);

    // check for a win after the computer's turn
    if (checkForWin(gameBoard.displayBoard()) == true) {
      screenController.displayOutcome("Computer wins!");
      gameFinished = true;

    } else if (checkForDraw() == true) {
      // check for a draw after the computer's turn
      screenController.displayOutcome("Draw")
      gameFinished = true;
    }
  }

  function checkForWin(grid) {

    const sum = (a,b,c) => a + b + c;

    // check rows
    if (sum(grid[0], grid[1], grid[2]) == 3 || sum(grid[0], grid[1], grid[2]) == 0) {
      return true
    } else if (sum(grid[3], grid[4], grid[5]) == 3 || sum(grid[3], grid[4], grid[5]) == 0) {
      return true
    } else if (sum(grid[6], grid[7], grid[8]) == 3 || sum(grid[6], grid[7], grid[8]) == 0) {
      return true
    }
    // check columns
    else if (sum(grid[0], grid[3], grid[6]) == 3 || sum(grid[0], grid[3], grid[6]) == 0) {
      return true
    } else if (sum(grid[1], grid[4], grid[7]) == 3 || sum(grid[1], grid[4], grid[7]) == 0) {
      return true
    } else if (sum(grid[2], grid[5], grid[8]) == 3 || sum(grid[2], grid[5], grid[8]) == 0) {
      return true
    }
    // check diagonals
    else if (sum(grid[0], grid[4], grid[8]) == 3 || sum(grid[0], grid[4], grid[8]) == 0) {
      return true
    } else if (sum(grid[2], grid[4], grid[6]) == 3 || sum(grid[2], grid[4], grid[6]) == 0) {
      return true
    }
    else {
      return false
    }
  }

  function checkForDraw() {
    if (turnCount == 8) {
      return true;
    } else {
      return false;
    }
  }

  function getRandomSquare() {
    const i = Math.floor(Math.random() * 9);
    return i;
  }

  function checkSquareIsEmpty(square) {
    const isEmpty = ( gameBoard.displaySquare(square) == undefined ? true : false );
    return isEmpty;
  }

  return { completePlayersTurn };
})();

const screenController = (function () {

  // loads the game board UI at the start of each game
  function loadBoardToDOM() {
    if (gridUI.hasChildNodes) {
      while (gridUI.firstChild) {
        gridUI.removeChild(gridUI.firstChild);
      }
    }
    for (let i = 0; i < 9; i++) {
      let div = document.createElement('div');
      div.id = `${i}`;
      div.classList.add(`grid-square`);
      div.addEventListener("click", () => {
        gameController.completePlayersTurn(i);
      })
      gridUI.appendChild(div);
    }
  };

  // displays X and O in the grid after each players turn
  function updateBoardDOM(symbol, i) {
    const square = document.getElementById(`${i}`);
    const display = (symbol == 1 ? "X" : "O");
    square.textContent = display;
  }

  // displays the outcome of the game - player wins, computer wins, draw
  function displayOutcome(message) {
    const p = document.createElement('p');
    p.innerText = `${message}`;
    resultContainer.appendChild(p);
  }

  function clearOutcome() {
    if (resultContainer.hasChildNodes) {
      while (resultContainer.firstChild) {
        resultContainer.removeChild(resultContainer.firstChild);
      }
    }
  }

  return { loadBoardToDOM, updateBoardDOM, displayOutcome, clearOutcome };
})();

document.onload = screenController.loadBoardToDOM();
const player = createPlayer("Player", 1)
const computer = createPlayer("Computer", 0)
xButton.classList.add('selected')
