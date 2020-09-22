"use strict";

function snakeGame() {
  console.log("started");

  const size = 20;
  const maxColumn = 20;
  const maxRow = 20;
  const LEFT = "left";
  const RIGHT = "right";
  const UP = "up";
  const DOWN = "down";
  let setIntervalId;
  let worldStates = {
    prevSnake: {},
    currentSnake: {
      positions: [
        [size * 2, size * 5, size, size],
        [size * 1, size * 5, size, size],
        [size * 0, size * 5, size, size],
      ],
      direction: RIGHT,
      alive: true,
    },
    gameOn: true,
  };

  function randomFood(ctx) {
    if (!worldStates.foodPosition) {
      let column = randomPosition();
      let row = randomPosition();
      worldStates.foodPosition = [column * size, row * size, size, size];
      ctx.fillRect(...worldStates.foodPosition);
    }
  }

  function randomPosition() {
    return Math.floor(Math.random() * maxColumn);
  }

  function initialState(ctx) {
    ctx.fillStyle = "green";
    worldStates.currentSnake.positions.forEach(function (item) {
      ctx.fillRect(...item);
    });
  }

  function nextGameState(context) {
    createNextWorldState();

    paint(context);
  }

  function createNextWorldState() {
    worldStates.prevSnake = JSON.parse(
      JSON.stringify(worldStates.currentSnake)
    );
    nextPosition();
  }
  function nextPosition() {
    let head = [...worldStates.currentSnake.positions[0]];
    let newValue;

    switch (worldStates.currentSnake.direction) {
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

    worldStates.currentSnake.positions.unshift(head);

    if (!ateFood(head)) worldStates.currentSnake.positions.pop();
    selfCollision(head);
    wallCollision(head);
  }

  function wallCollision(head) {
    if (head[0] < 0 || head[0] == maxColumn * size) endGame();

    if (head[1] < 0 || head[1] == maxRow * size) endGame();
  }

  function selfCollision(head) {
    for (let i = 1; i < worldStates.currentSnake.positions.length - 1; i++) {
      if (
        head[0] === worldStates.currentSnake.positions[i][0] &&
        head[1] === worldStates.currentSnake.positions[i][1]
      ) {
        endGame();
      }
    }
  }

  function ateFood(head) {
    if (!worldStates.foodPosition) return false;

    if (
      head[0] === worldStates.foodPosition[0] &&
      head[1] === worldStates.foodPosition[1]
    ) {
      worldStates.foodPosition = null;
      return true;
    }

    return false;
  }

  function paint(context) {
    if (!worldStates.gameOn) return;

    worldStates.prevSnake.positions.forEach(function (item) {
      context.clearRect(...item);
    });
    worldStates.currentSnake.positions.forEach(function (item) {
      context.fillRect(...item);
    });

    randomFood(context);
    context.fillStyle = "green";
  }

  function keyHandler(e, context) {
    console.log(e.key);

    switch (e.key) {
      case "ArrowRight":
        if (worldStates.currentSnake.direction != LEFT)
          worldStates.currentSnake.direction = RIGHT;
        break;
      case "ArrowLeft":
        if ((worldStates.currentSnake.direction = RIGHT))
          worldStates.currentSnake.direction = LEFT;
        break;
      case "ArrowDown":
        if (worldStates.currentSnake.direction != UP)
          worldStates.currentSnake.direction = DOWN;
        break;
      case "ArrowUp":
        if (worldStates.currentSnake.direction != DOWN)
          worldStates.currentSnake.direction = UP;
      default:
        return;
    }

    clearTimeout(setIntervalId);

    setIntervalId = setTimeout(function tick() {
      nextGameState(context);
      if (worldStates.gameOn) setIntervalId = setTimeout(tick, 150);
    }, 0);
  }

  function endGame(context) {
    console.log("You might have lost the game :(");
    window.clearInterval(setIntervalId);
    worldStates.gameOn = false;
    if (!!context) context.fillStyle = "black";
  }

  function init() {
    console.log("init");
    console.log(worldStates.currentSnake.positions);

    let myCanvas = document.getElementById("mycanvas");
    let ctx = myCanvas.getContext("2d");

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
