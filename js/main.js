/*----- constants -----*/ 
const BOARDST = {
  '0': 'grey',
  '1': 'black',
  '2': 'red'
};
const ship1 = {
  name
}
/*----- app's state (variables) -----*/ 
let board, turn, moves, winner;

/*----- cached element references -----*/ 

/*----- event listeners -----*/
document.querySelector('.container').addEventListener('click', whenClick);
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

function whenClick(evt) {
  let loc = parseInt(evt.target.id.replace('pos', ''));
  board[loc] = 1;
  console.log(loc);
  render();
}

function whenClick2(evt) {
  let loc = parseInt(evt.target.id.replace('posb', ''));
  board2[loc] = 1;
  console.log(loc);
  render();
}
