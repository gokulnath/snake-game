"use strict";

function snakeGame() {
  console.log("started");

  let snake = {};
  const size = 20;
  const maxColumn = 20;
  const maxRow = 20;
  const LEFT = "left";
  const RIGHT = "right";
  const UP = "up";
  const DOWN = "down";
  let setIntervalId;

  function randomFood(ctx) {
    if (!snake.foodPosition) {
      let column = randomPosition();
      let row = randomPosition();
      snake.foodPosition = [column * size, row * size, size, size];
      ctx.fillRect(...snake.foodPosition);
    }
  }

  function randomPosition() {
    return Math.floor(Math.random() * maxColumn);
  }

  function initialState(ctx) {
    if (!snake.positions) {
      snake.positions = [
        [size * 2, size * 5, size, size],
        [size * 1, size * 5, size, size],
        [size * 0, size * 5, size, size],
      ];

      snake.direction = RIGHT;
      snake.alive = true;

      snake.positions.forEach(function (item) {
        ctx.fillRect(...item);
      });

      ctx.fillStyle = "green";
    }
  }

  function nextPosition() {
    let head = [...snake.positions[0]];
    let newValue;

    switch (snake.direction) {
      case RIGHT:
        newValue = head[0] + size;
        head.splice(0, 1, newValue);
        break;
      case LEFT:
        newValue = head[0] - size;
        head.splice(0, 1, newValue);
        break;
      case UP:
        newValue = head[1] - size;
        head.splice(1, 1, newValue);
        break;
      case DOWN:
        newValue = head[1] + size;
        head.splice(1, 1, newValue);
        break;
    }

    snake.positions.unshift(head);

    if (!ateFood(head)) snake.positions.pop();
    selfCollision(head);
    wallCollision(head);
  }

  function wallCollision(head) {
    if (head[0] < 0 || head[0] == maxColumn * size) endGame();

    if (head[1] < 0 || head[1] == maxRow * size) endGame();
  }

  function selfCollision(head) {
    for (let i = 1; i < snake.positions.length - 1; i++) {
      if (
        head[0] === snake.positions[i][0] &&
        head[1] === snake.positions[i][1]
      ) {
        endGame();
      }
    }
  }

  function ateFood(head) {
    if (!snake.foodPosition) return false;

    if (
      head[0] === snake.foodPosition[0] &&
      head[1] === snake.foodPosition[1]
    ) {
      snake.foodPosition = null;
      return true;
    }

    return false;
  }

  function nextGameState(context) {
    stateTransform(context);
    paint(context);
  }
  function stateTransform(context) {
    snake.positions.forEach(function (item) {
      context.clearRect(...item);
    });

    nextPosition();
    randomFood(context);
  }
  function paint(context) {
    snake.positions.forEach(function (item) {
      context.fillRect(...item);
    });
    context.fillStyle = "green";
  }

  function keyHandler(e, context) {
    console.log(e.key);

    switch (e.key) {
      case "ArrowRight":
        if (snake.direction != LEFT) snake.direction = RIGHT;
        break;
      case "ArrowLeft":
        if ((snake.direction = RIGHT)) snake.direction = LEFT;
        break;
      case "ArrowDown":
        if (snake.direction != UP) snake.direction = DOWN;
        break;
      case "ArrowUp":
        if (snake.direction != DOWN) snake.direction = UP;
      default:
        return;
    }

    clearInterval(setIntervalId);

    setIntervalId = setTimeout(function tick() {
      nextGameState(context);
      if (snake.alive) setIntervalId = setTimeout(tick, 150);
    }, 0);
  }

  function endGame(context) {
    console.log("You might have lost the game :(");
    window.clearInterval(setIntervalId);
    snake.alive = false;
    if (!!context) context.fillStyle = "black";
  }

  function init() {
    let myCanvas = document.getElementById("mycanvas");
    let ctx = myCanvas.getContext("2d");
    ctx.fillStyle = "green";

    initialState(ctx);

    window.addEventListener("keydown", function (event) {
      keyHandler(event, ctx);
    });

    setIntervalId = window.setInterval(function () {
      nextGameState(ctx);
    }, 1 * 150);
  }

  init();
}

snakeGame();
