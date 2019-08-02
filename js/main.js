/*----- constants -----*/ 
BOARDST = {
  '0': 'grey',
  '1': 'black',
  '2': 'red',
};

/*----- app's state (variables) -----*/ 
let board, turn, moves, winner;

/*----- cached element references -----*/ 

/*----- event listeners -----*/

/*----- functions -----*/
init();
function init () {
  board = [
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0]
          ];
  board.forEach(function(cArr, cIdx) {
    cArr.forEach(function(sqr, rIdx) {
      let div = document.getElementById(`c${cIdx}r${rIdx}`);
      div.style.backgroundColor = BOARDST[sqr];
    });
  });       
}