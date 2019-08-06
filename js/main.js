/*----- constants -----*/ 
const BOARDST = {
  0: 'grey',
  1: 'black',
  2: 'red'
};

const SHIPS = {
  ship1: [0, 1],
  ship2: [0, 1],
  ship3: [0, 1, 2],
  ship4: [0, 1, 2, 3],
  ship1v: [0, 8],
  ship2v: [0, 8],
  ship3v: [0, 8, 16],
  ship4v: [0, 8, 16, 24],
}

const REDZONE = {
  h7: [7, 15, 23, 31, 39, 47, 55, 63],
  h6: [6, 14, 22, 30, 38, 46, 54, 62],
  h5: [5, 13, 21, 29, 37, 45, 53, 61],
  v40: [40, 41, 42, 43, 44, 45, 46, 47],
  v48: [48, 49, 50, 51, 52, 53, 54, 55],
  v56: [56, 57, 58, 59, 60, 61, 62, 63],
}

const AIDIR = [-1, 1]


/*----- app's state (variables) -----*/ 
let board, turn, moves, winner;
let shipPos = [];
let aiShipPos = [];
let hConstraints = [];
let vConstraints = [];
let s4VConstraints = [];
let s4HConstraints = [];
let s2VConstraints = [];
let s2HConstraints = [];
let aiS2VConstraints = [];
let aiS2HConstraints = [];
let aiSPlaced = 0;
let sPlaced = 0;
let dir = 1;

/*----- cached element references -----*/ 


/*----- event listeners -----*/
document.querySelector('.container2').addEventListener('click', whenClick2);
document.getElementById('btnS1').addEventListener('click', initS1);
document.getElementById('btnS2').addEventListener('click', initS2);
document.getElementById('btnS3').addEventListener('click', initS3);
document.getElementById('btnS4').addEventListener('click', initS4);
document.getElementById('btnRotate').addEventListener('click', rotate);

/*----- functions -----*/
init();
function init() {
  board = [
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0
          ];
  board2 = [
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
           0, 0, 0, 0, 0, 0, 0, 0,
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

function rotate() {
  dir *= -1;
}

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function aiRngDir(AIDIR) {
  return AIDIR[Math.floor(Math.random() * AIDIR.length)];
}

function initS1(){
  document.querySelector('.container').addEventListener('mouseover', hvrOverS1);
  document.querySelector('.container').addEventListener('mouseout', hvrOutS1);
  document.querySelector('.container').addEventListener('click', addS1);
}

function hvrOverS1(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) && !REDZONE.h7.includes(pos)) {
      SHIPS.ship1.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 2;
      });
    };
  };
  if (dir === -1) {
    if (!shipPos.includes(pos) && !REDZONE.v56.includes(pos)) {
      SHIPS.ship1v.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 2;
      })
    };
  };
  render();
}

function hvrOutS1(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) && !REDZONE.h7.includes(pos)) {
      SHIPS.ship1.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 0;
      });
    };
  };
  if (dir === -1) {
    if (!shipPos.includes(pos) && !REDZONE.v56.includes(pos)) {
      SHIPS.ship1v.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 0;
      })
    };
  };
  render();
}

function addS1(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) && !REDZONE.h7.includes(pos) 
      && !hConstraints.includes(pos)) {
      SHIPS.ship1.forEach(function(p, i) {
        let tpos = pos + p;
        shipPos.push(tpos);
        hConstraints.push(tpos - 1);
        hConstraints.push(tpos - 2);
        s2HConstraints.push(tpos - 1);
        s2VConstraints.push(tpos - 8);
        s4HConstraints.push(tpos - 3);
        s4VConstraints.push(tpos - 24);
        vConstraints.push(tpos - 8);
        vConstraints.push(tpos - 16);
        board[pos + p] = 1;
        sPlaced ++;
      });
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS1);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS1);
      document.querySelector('.container').removeEventListener('click', addS1);
      document.getElementById('btnS1').disabled = true;    
      render();
    } else {
      console.log('spot taken');
      return;
    }
  }
  if (dir === -1) {
    if (!shipPos.includes(pos) && !REDZONE.v56.includes(pos) 
      && !vConstraints.includes(pos)) {
      SHIPS.ship1v.forEach(function(p, i) {
        let tpos = pos + p;
        shipPos.push(tpos);
        hConstraints.push(tpos - 1);
        hConstraints.push(tpos - 2);
        vConstraints.push(tpos - 8);
        vConstraints.push(tpos - 16);
        s2HConstraints.push(tpos - 1);
        s2VConstraints.push(tpos - 8);
        s4HConstraints.push(tpos - 3);
        s4VConstraints.push(tpos - 24);
        board[pos + p] = 1;
        sPlaced ++;
        console.log(tpos);
      });
    } else {
      console.log('spot taken');
      return;
    }
    document.querySelector('.container').removeEventListener('mouseover', hvrOverS1);
    document.querySelector('.container').removeEventListener('mouseout', hvrOutS1);
    document.querySelector('.container').removeEventListener('click', addS1);
    document.getElementById('btnS1').disabled = true;    
    render();
  }
}

function initS2(){
  document.querySelector('.container').addEventListener('mouseover', hvrOverS2);
  document.querySelector('.container').addEventListener('mouseout', hvrOutS2);
  document.querySelector('.container').addEventListener('click', addS2);
}


function hvrOverS2(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.h7.includes(pos)
      && !s2HConstraints.includes(pos)) {
      SHIPS.ship2.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 2;
      });
    };
  };
  if (dir === -1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.v56.includes(pos)
      && !s2VConstraints.includes(pos)) {
      SHIPS.ship2v.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 2;
      })
    };
  };
  render();
}

function hvrOutS2(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.h7.includes(pos)
      && !s2HConstraints.includes(pos)) {
      SHIPS.ship2.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 0;
      });
    };
  };
  if (dir === -1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.v56.includes(pos)
      && !s2VConstraints.includes(pos)) {
      SHIPS.ship2v.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 0;
        console.log(tpos);
      });
    };
  };
  render();
}

function addS2(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.h7.includes(pos) 
      && !hConstraints.includes(pos)
      && !s2HConstraints.includes(pos)) {
      SHIPS.ship2.forEach(function(p, i) {
        let tpos = pos + p;
        shipPos.push(tpos);
        hConstraints.push(tpos - 1);
        hConstraints.push(tpos - 2);
        s4HConstraints.push(tpos -3);
        vConstraints.push(tpos - 8);
        vConstraints.push(tpos - 16);
        s4VConstraints.push(tpos - 24);
        board[pos + p] = 1;
        sPlaced ++;
      });
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS2);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS2);
      document.querySelector('.container').removeEventListener('click', addS2);
      document.getElementById('btnS2').disabled = true;    
      render();
    } else {
      console.log('spot taken');
      return;
    }
  }
  if (dir === -1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.v56.includes(pos) 
      && !vConstraints.includes(pos)
      && !s2VConstraints.includes(pos)) {
      SHIPS.ship2v.forEach(function(p, i) {
        let tpos = pos + p;
        shipPos.push(tpos);
        hConstraints.push(tpos - 1);
        hConstraints.push(tpos - 2);
        s4HConstraints.push(tpos -3);
        vConstraints.push(tpos - 8);
        vConstraints.push(tpos - 16);
        s4VConstraints.push(tpos - 24);
        board[pos + p] = 1;
        sPlaced ++;
        console.log(tpos);
      });
    } else {
      console.log('spot taken');
      return;
    }
    document.querySelector('.container').removeEventListener('mouseover', hvrOverS2);
    document.querySelector('.container').removeEventListener('mouseout', hvrOutS2);
    document.querySelector('.container').removeEventListener('click', addS2);
    document.getElementById('btnS2').disabled = true;    
    render();
  }
}

function initS3(){
  document.querySelector('.container').addEventListener('mouseover', hvrOverS3);
  document.querySelector('.container').addEventListener('mouseout', hvrOutS3);
  document.querySelector('.container').addEventListener('click', addS3);
}

function hvrOverS3(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.h7.includes(pos) 
      && !REDZONE.h6.includes(pos) 
      && !hConstraints.includes(pos)) {
      SHIPS.ship3.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 2;
        console.log(tpos);
      });
    };
    render();
  };
  if (dir === -1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.v56.includes(pos) 
      && !REDZONE.v48.includes(pos) 
      && !vConstraints.includes(pos)) {
      SHIPS.ship3v.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 2;
        console.log(tpos);
      });
    };
    render();
  };
};

function hvrOutS3(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.h7.includes(pos) 
      && !REDZONE.h6.includes(pos)
      && !hConstraints.includes(pos)) {
      SHIPS.ship3.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 0;
      });
    };
    render();
  };
  if (dir === -1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.v56.includes(pos) 
      && !REDZONE.v48.includes(pos)
      && !vConstraints.includes(pos)) {
      SHIPS.ship3v.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 0;
      })
    };
    render();
  };
}

function addS3(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.h6.includes(pos) 
      && !REDZONE.h7.includes(pos) 
      && !hConstraints.includes(pos)) {
      SHIPS.ship3.forEach(function(p, i) {
        let tpos = pos + p;
        shipPos.push(tpos);
        hConstraints.push(tpos - 1);
        hConstraints.push(tpos - 2);
        hConstraints.push(tpos - 3);
        vConstraints.push(tpos - 8);
        vConstraints.push(tpos - 16);
        vConstraints.push(tpos - 24);
        board[pos + p] = 1;
        sPlaced ++;
      });
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS3);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS3);
      document.querySelector('.container').removeEventListener('click', addS3);
      document.getElementById('btnS3').disabled = true;
      render();
    } else {
      console.log('spot taken');
      return;
    }
  }
  if (dir === -1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.v48.includes(pos) 
      && !REDZONE.v56.includes(pos) 
      && !vConstraints.includes(pos)) {
      SHIPS.ship3v.forEach(function(p, i) {
        let tpos = pos + p;
        console.log(tpos);
        shipPos.push(tpos);
        hConstraints.push(tpos - 1);
        hConstraints.push(tpos - 2);
        hConstraints.push(tpos - 3);
        vConstraints.push(tpos - 8);
        vConstraints.push(tpos - 16);
        vConstraints.push(tpos - 24);
        // vConstraints.push(tpos - 32);
        board[pos + p] = 1;
        sPlaced ++;
      });
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS3);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS3);
      document.querySelector('.container').removeEventListener('click', addS3);
      document.getElementById('btnS3').disabled = true;
      render();
    } else {
      console.log('spot taken');
      return;
    }
  }
}

function initS4(){
  document.querySelector('.container').addEventListener('mouseover', hvrOverS4);
  document.querySelector('.container').addEventListener('mouseout', hvrOutS4);
  document.querySelector('.container').addEventListener('click', addS4);
}

function hvrOverS4(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.h7.includes(pos) 
      && !REDZONE.h6.includes(pos)
      && !REDZONE.h5.includes(pos)
      && !hConstraints.includes(pos)
      && !s4HConstraints.includes(pos)) {
      SHIPS.ship4.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 2;
        console.log(tpos);
      });
    };
    render();
  };
  if (dir === -1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.v56.includes(pos) 
      && !REDZONE.v48.includes(pos)
      && !REDZONE.v40.includes(pos) 
      && !vConstraints.includes(pos)
      && !s4VConstraints.includes(pos)) {
      SHIPS.ship4v.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 2;
        console.log(tpos);
      });
    };
    render();
  };
};

function hvrOutS4(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.h7.includes(pos) 
      && !REDZONE.h6.includes(pos)
      && !REDZONE.h5.includes(pos)
      && !hConstraints.includes(pos)
      && !s4HConstraints.includes(pos)) {
      SHIPS.ship4.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 0;
      });
    };
    render();
  };
  if (dir === -1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.v56.includes(pos) 
      && !REDZONE.v48.includes(pos)
      && !REDZONE.v40.includes(pos)
      && !vConstraints.includes(pos)
      && !s4VConstraints.includes(pos)) {
      SHIPS.ship4v.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 0;
      })
    };
    render();
  };
}

function addS4(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.h6.includes(pos) 
      && !REDZONE.h7.includes(pos) 
      && !REDZONE.h5.includes(pos)
      && !hConstraints.includes(pos)
      && !s4HConstraints.includes(pos)) {
      SHIPS.ship4.forEach(function(p, i) {
        let tpos = pos + p;
        shipPos.push(tpos);
        board[pos + p] = 1;
        sPlaced ++;
      });
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS4);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS4);
      document.querySelector('.container').removeEventListener('click', addS4);
      document.getElementById('btnS4').disabled = true;
      render();
    } else {
      console.log('spot taken');
      return;
    }
  }
  if (dir === -1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.v40.includes(pos) 
      && !REDZONE.v48.includes(pos) 
      && !REDZONE.v56.includes(pos)
      && !vConstraints.includes(pos)
      && !s4VConstraints.includes(pos)) {
      SHIPS.ship4v.forEach(function(p, i) {
        let tpos = pos + p;
        shipPos.push(tpos);
        board[pos + p] = 1;
        sPlaced ++;
      });
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS4);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS4);
      document.querySelector('.container').removeEventListener('click', addS4);
      document.getElementById('btnS4').disabled = true;
      render();
    } else {
      console.log('spot taken');
      return;
    }
  }
}

function whenClick2(evt) {
  let loc = parseInt(evt.target.id.replace('posb', ''));
  board2[loc] = 1;
  console.log(loc);
  render();
}

function aiShip1() {
  let ship1Arr = new Array();
  let aiDirection = aiRngDir(AIDIR);
  console.log(`AI is going ` + aiDirection);
  if (aiDirection === 1) {
    for (var i = 0; i < 64; i++)
      if (!REDZONE.h7.includes(i)) {
        ship1Arr.push(i);
      }
    let rngPos = aiRngDir(ship1Arr);
    console.log(rngPos);
    SHIPS.ship1.forEach(function(p, i) {
      let aiTPos = rngPos + p;
      aiShipPos.push(aiTPos);
      aiS2HConstraints.push(aiTPos - 1);
      aiS2VConstraints.push(aiTPos - 8);
      board2[rngPos + p] = 1;
      aiSPlaced ++;
    });   
  }
  if (aiDirection === -1) {
    for (var i = 0; i < 64; i++)
      if (!REDZONE.v56.includes(i)) {
        ship1Arr.push(i);
      }
    let rngPos = aiRngDir(ship1Arr);
    console.log(rngPos);
    SHIPS.ship1v.forEach(function(p, i) {
      let aiTPos = rngPos + p;
      aiShipPos.push(aiTPos);
      aiS2HConstraints.push(aiTPos - 1);
      aiS2VConstraints.push(aiTPos - 8);
      board2[rngPos + p] = 1;
      aiSPlaced ++;
    }); 
  }
  render();
}


// function aiShip1() {
//   let aiDirection = aiRngDir(AIDIR);
//   console.log(`AI is going ` + aiDirection);
//   if (aiDirection === 1) {
//     let rngPos = rng(0, 63);
//     console.log(rngPos);
//     if (!REDZONE.h7.includes(rngPos)) {
//       SHIPS.ship1.forEach(function(p, i) {
//         let aiTPos = rngPos + p;
//         aiShipPos.push(aiTPos);
//         aiS2HConstraints.push(aiTPos - 1);
//         aiS2VConstraints.push(aiTPos - 8);
//         board2[rngPos + p] = 1;
//         aiSPlaced ++;
//       });
//     } else {
//       return;
//     }
//   }
//   if (aiDirection === -1) {
//     let rngPos = rng(0, 63);
//     console.log(rngPos);
//     if (!REDZONE.v56.includes(rngPos)) {
//       SHIPS.ship1v.forEach(function(p, i) {
//         let aiTPos = rngPos + p;
//         aiShipPos.push(aiTPos);
//         aiS2HConstraints.push(aiTPos - 1);
//         aiS2VConstraints.push(aiTPos - 8);
//         board2[rngPos + p] = 1;
//         aiSPlaced ++;
//       });
//     } else {
//       return;
//     }
//   }
//   render();
// }

aiShip1();

// function addShip3(pos) {
//   SHIPS.ship3.forEach(function(p, i) {
//     let tpos = pos + p;
//     shipPos.push(tpos);
//     shipPos.push(tpos - 1);
//     shipPos.push(tpos - 2);
//     board[pos + p] = 1;
//     sPlaced ++;
//     console.log(shipPos);
//     console.log(tpos);
//   });
// }

// function checkValid(pos) {
//   SHIPS.ship3.forEach(function(p, i){
//     let tpos = pos + p;
//     if (!shipPos.includes(tpos)) {
//       return true;
//     } else {
//       return;
//     }
//   });
// }






// generate random direction

// random number > check if that number is Valid

// if valid > place ship