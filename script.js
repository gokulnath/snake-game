"use strict";

function snakeGame() {
  console.log("started");

  let snake = {};
  const size = 40;
  const maxColumn = 10;
  const maxRow = 10;
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

      snake.positions.forEach(function (item) {
        ctx.fillRect(...item);
      });
    }
  }

  function incrementPosition(ctx) {
    snake.positions.forEach(function (item) {
      ctx.clearRect(...item);
    });

    nextPosition();

    snake.positions.forEach(function (item) {
      ctx.fillRect(...item);
    });
  }

  function nextPosition() {
    let head;
    let newValue;

    switch (snake.direction) {
      case RIGHT:
        head = [...snake.positions[0]];
        newValue = head[0] + size;
        head.splice(0, 1, newValue);
        break;
      case LEFT:
        head = [...snake.positions[0]];
        newValue = head[0] - size;
        head.splice(0, 1, newValue);
        break;
      case UP:
        head = [...snake.positions[0]];
        newValue = head[1] - size;
        head.splice(1, 1, newValue);
        break;
      case DOWN:
        head = [...snake.positions[0]];
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

  function draw() {
    let myCanvas = document.getElementById("mycanvas");
    let ctx = myCanvas.getContext("2d");
    ctx.fillStyle = "green";
    initialState(ctx);
    incrementPosition(ctx);
    randomFood(ctx);
  }

  function keyHandler(e) {
    console.log(e.key);
    if (e.key === "Enter") {
      console.log("starting again");
      init();
    }
    if (e.key === "Escape") {
      console.log("pressing ESC stops the game");
      endGame();
    }

    switch (e.key) {
      case "ArrowRight":
        if (snake.direction != LEFT) snake.direction = RIGHT;
        break;
      case "ArrowLeft":
        if (snake.direction != RIGHT) snake.direction = LEFT;
        break;
      case "ArrowDown":
        if (snake.direction != UP) snake.direction = DOWN;
        break;
      case "ArrowUp":
        if (snake.direction != DOWN) snake.direction = UP;
    }
  }

  function endGame() {
    console.log("You might have lost the game :(");
    window.clearInterval(setIntervalId);
  }

  function init() {
    window.addEventListener("keydown", keyHandler);
    setIntervalId = window.setInterval(draw, 1 * 1000);
  }

  init();
}

snakeGame();
