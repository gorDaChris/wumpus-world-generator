const c = document.getElementById("canvas").getContext("2d");
let goldImage = document.getElementById("gold");
let wumpusImage = document.getElementById("wumpus");
let pitImage = document.getElementById("pit");
let robotImage = document.getElementById("robot");
let width;
let height;
let numPits;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// <-- START ANIMATIONS -->
gsap.registerPlugin(ScrollTrigger);
// <-- END ANIMATIONS -->

// <-- START GENERATE BOARD -->
document.getElementById("myGenerate").onclick = function() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  width = document.getElementById("myWidth").value;
  height = document.getElementById("myHeight").value;
  numPits = document.getElementById("myPits").value;

  /*
  Before we check the board:
  (1) draw rectangles that makes up the board - drawBoard()
  (2) establish positions of entities within the board  - defineBoard()
  (3) display images inside each grid - drawImage()
  */
  drawBoard(width, height);
  // world ==> [board, objects]
  // board is a 2d array representing Wumpus World
  // objects is an array storing the location of gold, wumpus, and pits
  let world = defineBoard(width, height);
  drawImage(world);




  // meat of the program!!
  let isValidBoard = checkBoard(world, width, height);

  while(!isValidBoard) {
    world = defineBoard(width, height);
    isValidBoard = checkBoard(world, width, height);
    drawImage(world);
  }

}

function drawBoard(width, height) {
  for(let i = 0; i < height; i++) {
    for(let j = 0; j < width; j++) {
      // each of these small rectangles (tiles) make up the entire board
      c.strokeRect(j * 54, i * 54, 54, 54);
    }
  }
}

function defineBoard(width, height) {
  // we will represent our board as a 2d array
  let board = [];
  for(let i = 0; i < height; i++) {
    board[i] = [];
    for(let j = 0; j < width; j++) {
      board[i][j] = {
        empty: 1,
        robot: 0,
        gold: 0,
        glitter: 0,
        wumpus: 0,
        stench: 0,
        pit: 0,
        breeze: 0
      };
    }
  }
  // robot always starts on the bottom left
  board[height - 1][0].robot = 1;
  board[height - 1][0].empty = 0;
  // give each tile an attribute
  let goldX = Math.floor(Math.random() * width);
  let goldY = Math.floor(Math.random() * height);
  while(board[goldY][goldX].empty == 0) {
    goldX = Math.floor(Math.random() * width);
    goldY = Math.floor(Math.random() * height);
  }
  board[goldY][goldX].gold = 1;
  board[goldY][goldX].empty = 0;
  if(goldY - 1 >= 0)
  {
    board[goldY - 1][goldX].glitter = 1;
  }
  if(goldY + 1 < width)
  {
    board[goldY + 1][goldX].glitter = 1;
  }
  if(goldX - 1 >= 0)
  {
    board[goldY][goldX - 1].glitter = 1;
  }
  if(goldX + 1 < height)
  {
    board[goldY][goldX + 1].glitter = 1;
  }

  let wumpusX = Math.floor(Math.random() * width);
  let wumpusY = Math.floor(Math.random() * height);
  // we want to ensure there is no overlap
  while(board[wumpusY][wumpusX].empty == 0) {
    wumpusX = Math.floor(Math.random() * width);
    wumpusY = Math.floor(Math.random() * height);
  }
  board[wumpusY][wumpusX].wumpus = 1;
  board[wumpusY][wumpusX].empty = 0;
  if(wumpusY - 1 >= 0)
  {
    board[wumpusY - 1][wumpusX].stench = 1;
  }
  if(wumpusY + 1 < width)
  {
    board[wumpusY + 1][wumpusX].stench = 1;
  }
  if(wumpusX - 1 >= 0)
  {
    board[wumpusY][wumpusX - 1].stench = 1;
  }
  if(wumpusX + 1 < height)
  {
    board[wumpusY][wumpusX + 1].stench = 1;
  }

  for(let i = 0; i < numPits; i++) {
    let pitX = Math.floor(Math.random() * width);
    let pitY = Math.floor(Math.random() * height);
    // we want to ensure there is no overlap
    while(board[pitY][pitX].empty == 0) {
      pitX = Math.floor(Math.random() * width);
      pitY = Math.floor(Math.random() * height);
    }
    board[pitY][pitX].pit = 1;
    board[pitY][pitX].empty = 0;
    if(pitY - 1 >= 0)
    {
      board[pitY - 1][pitX].breeze = 1;
    }
    if(pitY + 1 < width)
    {
      board[pitY + 1][pitX].breeze = 1;
    }
    if(pitX - 1 >= 0)
    {
      board[pitY][pitX - 1].breeze = 1;
    }
    if(pitX + 1 < height)
    {
      board[pitY][pitX + 1].breeze = 1;
    }
  }
  return board;
}

function drawImage(board) {
  for(let i = 0; i < height; i++) {
    for(let j = 0; j < width; j++) {
      c.clearRect(j * 54 + 2, i * 54 + 2, 50, 50);
    }
  }

  for(let i = 0; i < height; i++) {
    for(let j = 0; j < width; j++) {
      if(board[i][j].gold == 1) {
        c.drawImage(goldImage, j * 54 + 2, i * 54 + 2, 50, 50);
      }
      else if(board[i][j].wumpus == 1) {
        c.drawImage(wumpusImage, j * 54 + 2, i * 54 + 2, 50, 50);
      }
      else if(board[i][j].pit == 1) {
        c.drawImage(pitImage, j * 54 + 2, i * 54 + 2, 50, 50);
      }
      else if(board[i][j].robot == 1) {
        c.drawImage(robotImage, j * 54 + 2, i * 54 + 2, 50, 50);
      }
    }
  }

}

function checkBoard(board, width, height) {
  if(board[height - 1][0].wumpus == 1 || board[height - 1][0].pit == 1 || board[height - 2][0].wumpus == 1 || board[height - 2][0].pit == 1  || board[height - 1][1].wumpus == 1 || board[height - 1][1].pit == 1) {
    return false;
  }

  let knowledge = [];
  /* STEP 0: Instantiate object with flags for each position */
  for(let i = 0; i < height; i++)
  {
    knowledge[i] = [];
    for(let j = 0; j < width; j++)
    {
      knowledge[i][j] = {
        safe: 0,
        glitter: 0,
        stench: 0,
        breeze: 0,
        knowNotWumpus: 0,
        knowNotPit: 0,
        knowWumpus: 0,
        knowPit: 0
      };
    }
  }

  /* STEP 1: Set initial flags - what we know before applying rules */
  knowledge[height - 1][0].safe = 1;
  knowledge[height - 1][0].knowNotWumpus = 1;
  knowledge[height - 1][0].knowNotPit = 1;

  /* STEP 2: Apply rules here! */
  let updates = 1;
  while(updates > 0) {
    updates = 0;
    for(let i = 0; i < height; i++) {
      for(let j = 0; j < width; j++) {
        if(knowledge[i][j].knowNotWumpus == 1 && knowledge[i][j].knowNotPit == 1 && knowledge[i][j].safe == 0) {
          knowledge[i][j].safe = 1;
          updates++;
        }
        if(knowledge[i][j].safe == 1) {
          // we are done once safe is on gold
          if(board[i][j].gold == 1) {
            return true;
          }
          if(board[i][j].glitter == 1 && knowledge[i][j].glitter == 0) {
            knowledge[i][j].glitter = 1;
            updates++;
          }
          if(board[i][j].stench == 1 && knowledge[i][j].stench == 0) {
            knowledge[i][j].stench = 1;
            updates++;
          }
          if(board[i][j].breeze == 1 && knowledge[i][j].breeze == 0) {
            knowledge[i][j].breeze = 1;
            updates++;
          }

          // any square without a stench has no Wumpus around it
          // any square without a breeze has no pit around it
          if(i - 1 >= 0)
          {
            if(knowledge[i][j].stench == 0 && knowledge[i - 1][j].knowNotWumpus == 0) {
              knowledge[i - 1][j].knowNotWumpus = 1;
              updates++;
            }
            if(knowledge[i][j].breeze == 0 && knowledge[i - 1][j].knowNotPit == 0) {
              knowledge[i - 1][j].knowNotPit = 1;
              updates++;
            }
          }
          if(i + 1 < width)
          {
            if(knowledge[i][j].stench == 0 && knowledge[i + 1][j].knowNotWumpus == 0) {
              knowledge[i + 1][j].knowNotWumpus = 1;
              updates++;
            }
            if(knowledge[i][j].breeze == 0 && knowledge[i + 1][j].knowNotPit == 0) {
              knowledge[i + 1][j].knowNotPit = 1;
              updates++;
            }
          }
          if(j - 1 >= 0)
          {
            if(knowledge[i][j].stench == 0 && knowledge[i][j - 1].knowNotWumpus == 0) {
              knowledge[i][j - 1].knowNotWumpus = 1;
              updates++;
            }
            if(knowledge[i][j].breeze == 0 && knowledge[i][j - 1].knowNotPit == 0) {
              knowledge[i][j - 1].knowNotPit = 1;
              updates++;
            }
          }
          if(j + 1 < height)
          {
            if(knowledge[i][j].stench == 0 && knowledge[i][j + 1].knowNotWumpus == 0) {
              knowledge[i][j + 1].knowNotWumpus = 1;
              updates++;
            }
            if(knowledge[i][j].breeze == 0 && knowledge[i][j + 1].knowNotPit == 0) {
              knowledge[i][j + 1].knowNotPit = 1;
              updates++;
            }
          }

          // <-- BEGIN RULESET -->
          // if we KNP or KNW for three adjacent square, remaining square is KP or KW
          let numKNP = countKNP(i, j, knowledge);
          if(knowledge[i][j].breeze == 1 && numKNP[0] == 3 && knowledge[numKNP[1]][numKNP[2]].knowPit == 0) {
            knowledge[numKNP[1]][numKNP[2]].knowPit = 1;
            updates++;
          }
          let numKNW = countKNW(i, j, knowledge);
          if(knowledge[i][j].stench == 1 && numKNW[0] == 3 && knowledge[numKNW[1]][numKNW[2]].knowWumpus == 0) {
            knowledge[numKNW[1]][numKNW[2]].knowNotWumpus = 1;
            // shoot Wumpus
            if(numKNW[1] - 1 >= 0)
            {
              knowledge[numKNW[1] - 1][numKNW[2]].stench = 0;
            }
            if(numKNW[1] + 1 < width)
            {
              knowledge[numKNW[1] + 1][numKNW[2]].stench = 0;
            }
            if(numKNW[2] - 1 >= 0)
            {
              knowledge[numKNW[1]][numKNW[2] - 1].stench = 0;
            }
            if(numKNW[2] + 1 < height)
            {
              knowledge[numKNW[1]][numKNW[2] + 1].stench = 0;
            }
            updates++;
          }
          // <-- END RULESET -->
        }
      }
    }

  }

/*
  for(let i = 0; i < height; i++) {
    let str = "";
    for(let j = 0; j < width; j++) {
      str += knowledge[i][j].knowNotWumpus + " ";
    }
    console.log(str);
  }*/



  // failed!
  return false;
}
// <-- END GENERATE BOARD -->

function countKNP(i, j, knowledge) {
  let numKNP = 0;
  let pitX = -1;
  let pitY = -1;
  if(i - 1 >= 0 && knowledge[i - 1][j].knowNotPit == 1) {
    numKNP++;
  }
  else if(i - 1 < 0) {
    numKNP++;
  }
  else {
    pitX = i - 1;
    pitY = j;
  }
  if(i + 1 < width && knowledge[i + 1][j].knowNotPit == 1)
  {
    numKNP++;
  }
  else if(i + 1 >= width) {
    numKNP++;
  }
  else {
    pitX = i + 1;
    pitY = j;
  }
  if(j - 1 >= 0 && knowledge[i][j - 1].knowNotPit == 1)
  {
    numKNP++;
  }
  else if(j - 1 < 0) {
    numKNP++;
  }
  else {
    pitX = i;
    pitY = j - 1;
  }
  if(j + 1 < height && knowledge[i][j + 1].knowNotPit == 1)
  {
    numKNP++;
  }
  else if(j + 1 >= height) {
    numKNP++;
  }
  else {
    pitX = i;
    pitY = j + 1;
  }
  return [numKNP, pitX, pitY];
}

function countKNW(i, j, knowledge) {
  let numKNW = 0;
  let wumpusX = -1;
  let wumpusY = -1;
  if(i - 1 >= 0 && knowledge[i - 1][j].knowNotWumpus == 1)
  {
    numKNW++;
  }
  else if(i - 1 < 0) {
    numKNW++;
  }
  else {
    wumpusX = i - 1;
    wumpusY = j;
  }
  if(i + 1 < width && knowledge[i + 1][j].knowNotWumpus == 1)
  {
    numKNW++;
  }
  else if(i + 1 >= width) {
    numKNW++;
  }
  else {
    wumpusX = i + 1;
    wumpusY = j;
  }
  if(j - 1 >= 0 && knowledge[i][j - 1].knowNotWumpus == 1)
  {
    numKNW++;
  }
  else if(j - 1 < 0) {
    numKNW++;
  }
  else {
    wumpusX = i;
    wumpusY = j - 1;
  }
  if(j + 1 < height && knowledge[i][j + 1].knowNotWumpus == 1)
  {
    numKNW++;
  }
  else if(j + 1 >= height) {
    numKNW++;
  }
  else {
    wumpusX = i;
    wumpusY = j + 1;
  }
  return [numKNW, wumpusX, wumpusY];
}
