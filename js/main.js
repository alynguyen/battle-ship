/*----- constants -----*/ 
const BOARDST = {
  0: 'grey',
  1: 'black',
  2: 'red'
};
const SHIPS = {
  ship1: 0,
  ship2: 1,
  ship3: 2
}
/*----- app's state (variables) -----*/ 
let board, turn, moves, winner;
let shipPos = [];

/*----- cached element references -----*/ 

/*----- event listeners -----*/
document.querySelector('.container').addEventListener('click', placeShip);
document.querySelector('.container2').addEventListener('click', whenClick2);


/*----- functions -----*/
init();
function init() {
  board = [
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 1, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0
          ];
  board2 = [
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 1, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0
          ];        
  render();
}

function render() {
  board.forEach(function(sqr, idx) {
    let squares = document.getElementById(`pos${idx}`);
    squares.style.backgroundColor = BOARDST[sqr];
  });
  board2.forEach(function(sqr2, idx2){
    let squares2 = document.getElementById(`posb${idx2}`);
    squares2.style.backgroundColor = BOARDST[sqr2];
  });
}

function placeShip(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (!shipPos.includes(pos)) {
    board[pos] = 1;
    board[pos + SHIPS.ship2] = 1;
    shipPos.push(pos);
    console.log(shipPos);
  } else {
    console.log('spot taken');
    return;
  }
  render();
}

function whenClick2(evt) {
  let loc = parseInt(evt.target.id.replace('posb', ''));
  board2[loc] = 1;
  console.log(loc);
  render();
}
