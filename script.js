
const BLOCK_SIZE = 30;
let score = 0;
const scoreEl = document.getElementById('score');
let time = 0;
let timeInterval;
const timeEl = document.getElementById('time');
const bestScoreEl = document.getElementById('best-score');
let bestScore = localStorage.getItem('bestScore') || 0;
bestScoreEl.innerText = bestScore;
const startBtn = document.querySelector('.start-btn');
const modal = document.querySelector('.modal');


const board = document.querySelector('.board');
const blocks = {};

let snake = [{ x: 1, y: 3 }];
let direction = "right";
let intervalId = null;

const cols = Math.floor(board.clientWidth / BLOCK_SIZE);
const rows = Math.floor(board.clientHeight / BLOCK_SIZE);
startBtn.addEventListener('click', () => {
modal.style.display = 'none';
  startGame(); // start game loop
});
const restartBtn = document.querySelector('.restart-btn');

restartBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  startGame();
});





function startGame() {
  resetGame();
  startTimer(); // 🔥 add this
  intervalId = setInterval(gameLoop, 300);
 
}
let food = generateFood();


function createGrid() {
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const block = document.createElement('div');
      block.classList.add('block');
      board.appendChild(block);

      blocks[`${i},${j}`] = block;
    }
  }
}
function isSelfCollision(head) {
  // ignore last segment (tail), because it moves
  return snake.slice(0, -1).some(seg => seg.x === head.x && seg.y === head.y);
}


function generateFood() {
  let newFood;

  do {
    newFood = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows)
    };
  } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));

  return newFood;
}


function getNextHead() {
  const current = snake[0];

  if (direction === "left") return { x: current.x - 1, y: current.y };
  if (direction === "right") return { x: current.x + 1, y: current.y };
  if (direction === "up") return { x: current.x, y: current.y - 1 };
  if (direction === "down") return { x: current.x, y: current.y + 1 };
}

function isOutOfBounds(head) {
  return head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
}
  function updateScore() {
  scoreEl.innerText = score;
}

function updateSnake(head) {
  snake.unshift(head);

 if (head.x === food.x && head.y === food.y) {
  score++;
  updateScore();

  clearInterval(intervalId);
  intervalId = setInterval(gameLoop, Math.max(80, 300 - score * 10));

  blocks[`${food.x},${food.y}`].classList.remove('food');
  food = generateFood();
  } else {
    snake.pop();
  }
}
function gameOver() {
  clearInterval(intervalId);
  clearInterval(timeInterval);

  modal.classList.remove('hidden');

  modal.querySelector('h3').innerText = `Game Over! Score: ${score}`;
}

function clearBoard() {
  Object.values(blocks).forEach(block => {
    block.classList.remove('filled', 'head', 'food');
  });
}

function renderFood() {
  blocks[`${food.x},${food.y}`].classList.add('food');
}

function renderSnake() {
  snake.forEach((segment, index) => {
    const block = blocks[`${segment.x},${segment.y}`];

    block.classList.add('filled');

    if (index === 0) {
      block.classList.add('head');
    }
  });
}

function render() {
  clearBoard();
  renderFood();
  renderSnake();
}


function gameLoop() {
  const head = getNextHead();

  if (isOutOfBounds(head) || isSelfCollision(head)) {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore);
    bestScoreEl.innerText = bestScore;
  }

  clearInterval(intervalId);
  clearInterval(timeInterval);
  alert("Game Over!");
  return;
}

  updateSnake(head);
  render();
}
  function updateTime() {
  timeEl.innerText = time;
}

function startTimer() {
  timeInterval = setInterval(() => {
    time++;
    updateTime();
  }, 1000);
}

function handleKeydown(e) {
  if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
  else if (e.key === "ArrowRight" && direction !== "left") direction = "right";
  else if (e.key === "ArrowUp" && direction !== "down") direction = "up";
  else if (e.key === "ArrowDown" && direction !== "up") direction = "down";
}
function resetGame() {
  snake = [{ x: 1, y: 3 }];
  direction = "right";
  score = 0;
  time = 0;

  food = generateFood();

  updateScore();
  updateTime();

  clearBoard();
  render();
}

function init() {
  createGrid();
  render();
  addEventListener('keydown', handleKeydown);
}
init();

