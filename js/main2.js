 
 /*----- constants -----*/ 
const BOARDST = {
  0: 'grey',
  1: 'black',
  2: 'red',
  3: 'blue',
};

const SHIPGX = {
  0: '',
  1: '<img class="img-pir" src="img/pirate.png">',
  2: '<img class="img-pir2" src="img/pirate2.png">',
  3: '<img class="img-boat" src="img/boat.png">',
  4: '<img class="img-ship" src="img/ship.gif">',
  5: '<img class="img-fire" src="img/fire.gif">',
  6: '<img class="img-miss" src="">',
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

const AIBORDERS = {
  r0: [0, 1 , 2 , 3, 4, 5, 6, 7],
  r56: [56, 57, 58, 59, 60, 61, 62, 63],
  c7: [7, 15, 23, 31, 39, 47, 55, 63],
  c0: [0, 8, 16, 24, 32, 40, 48, 56]
}

const AIDIR = [-1, 1];
const SHIPSINPLAY = 11;
const HARDMODE = 0;

let explode = new Audio();
explode.src = "audio/explode.wav";
let splash = new Audio();
splash.src = "audio/splash.wav";
let select = new Audio();
select.src = "audio/select.wav";
let startsnd = new Audio();
startsnd.src = "audio/gamestart.wav";


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
let aiS2HConstraints = [];
let aiS2VConstraints = [];
let aiS3HConstraints = [];
let aiS3VConstraints = [];
let aiS4HConstraints = [];
let aiS4VConstraints = [];
let aiSPlaced = 0;
let sPlaced = 0;
let dir = 1;
let posFired = [];
let aiPosFired = [];
let hits = 0;
let aiHits = 0;
let aiMiss = true;
let aiHardArr = [];
let aiNextHit = null;
let aiLastHit = null;
let aiHitAgain = false;

/*----- cached element references -----*/ 


/*----- event listeners -----*/
document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('btn-s1').addEventListener('click', initS1);
document.getElementById('btn-s2').addEventListener('click', initS2);
document.getElementById('btn-s3').addEventListener('click', initS3);
document.getElementById('btn-s4').addEventListener('click', initS4);
document.getElementById('btn-rotate').addEventListener('click', rotate);

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
  select.play();
  dir *= -1;
}

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function aiRng(AIDIR) {
  return AIDIR[Math.floor(Math.random() * AIDIR.length)];
}

function initS1(){
  document.querySelector('.container').addEventListener('mouseover', hvrOverS1);
  document.querySelector('.container').addEventListener('mouseout', hvrOutS1);
  document.querySelector('.container').addEventListener('click', addS1);
  select.play();
}

function checkWinner() {
  if (hits === aiSPlaced) {
    console.log('Player Wins');
    document.querySelector('.container2').removeEventListener('click', pewPew);
  }
  if (aiHits === sPlaced) {
    console.log('AI wins');
  }
}

function hvrOverS1(evt) {
  let pos = parseInt(evt.target.id.replace('pos', ''));
  if (dir === 1) {
    if (!shipPos.includes(pos) && !REDZONE.h7.includes(pos)) {
      SHIPS.ship1.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 3;
      });
    };
  };
  if (dir === -1) {
    if (!shipPos.includes(pos) && !REDZONE.v56.includes(pos)) {
      SHIPS.ship1v.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 3;
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
      select.play();
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS1);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS1);
      document.querySelector('.container').removeEventListener('click', addS1);
      document.getElementById('btn-s1').disabled = true;    
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
    document.getElementById('btn-s1').disabled = true;    
    render();
  }
}

function initS2(){
  select.play();
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
        board[pos + p] = 3;
      });
    };
  };
  if (dir === -1) {
    if (!shipPos.includes(pos) 
      && !REDZONE.v56.includes(pos)
      && !s2VConstraints.includes(pos)) {
      SHIPS.ship2v.forEach(function(p, i) {
        let tpos = pos + p;
        board[pos + p] = 3;
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
      select.play();
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS2);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS2);
      document.querySelector('.container').removeEventListener('click', addS2);
      document.getElementById('btn-s2').disabled = true;    
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
    select.play();
    document.querySelector('.container').removeEventListener('mouseover', hvrOverS2);
    document.querySelector('.container').removeEventListener('mouseout', hvrOutS2);
    document.querySelector('.container').removeEventListener('click', addS2);
    document.getElementById('btn-s2').disabled = true;    
    render();
  }
}

function initS3(){
  select.play();
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
        board[pos + p] = 3;
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
        board[pos + p] = 3;
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
      select.play();
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS3);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS3);
      document.querySelector('.container').removeEventListener('click', addS3);
      document.getElementById('btn-s3').disabled = true;
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
      select.play();
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS3);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS3);
      document.querySelector('.container').removeEventListener('click', addS3);
      document.getElementById('btn-s3').disabled = true;
      render();
    } else {
      console.log('spot taken');
      return;
    }
  }
}

function initS4(){
  select.play();
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
        board[pos + p] = 3;
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
        board[pos + p] = 3;
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
      select.play();
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS4);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS4);
      document.querySelector('.container').removeEventListener('click', addS4);
      document.getElementById('btn-s4').disabled = true;
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
      select.play()
      document.querySelector('.container').removeEventListener('mouseover', hvrOverS4);
      document.querySelector('.container').removeEventListener('mouseout', hvrOutS4);
      document.querySelector('.container').removeEventListener('click', addS4);
      document.getElementById('btn-s4').disabled = true;
      render();
    } else {
      console.log('spot taken');
      return;
    }
  }
}

function aiShip1() {
  let ship1Arr = new Array();
  let aiDirection = aiRng(AIDIR);
  console.log(`AI is going ` + aiDirection);
  if (aiDirection === 1) {
    for (var i = 0; i < 64; i++)
      if (!REDZONE.h7.includes(i)) {
        ship1Arr.push(i);
      }
    let rngPos = aiRng(ship1Arr);
    console.log(rngPos);
    SHIPS.ship1.forEach(function(p, i) {
      let aiTPos = rngPos + p;
      aiShipPos.push(aiTPos);
      aiS2HConstraints.push(aiTPos - 1);
      aiS2VConstraints.push(aiTPos - 8);
      aiS3VConstraints.push(aiTPos - 16);
      aiS3HConstraints.push(aiTPos - 2);
      board2[rngPos + p] = 1;
      aiSPlaced ++;
    });   
  }
  if (aiDirection === -1) {
    for (var i = 0; i < 64; i++)
      if (!REDZONE.v56.includes(i)) {
        ship1Arr.push(i);
      }
    let rngPos = aiRng(ship1Arr);
    console.log(rngPos);
    SHIPS.ship1v.forEach(function(p, i) {
      let aiTPos = rngPos + p;
      aiShipPos.push(aiTPos);
      aiS2HConstraints.push(aiTPos - 1);
      aiS2VConstraints.push(aiTPos - 8);
      aiS3VConstraints.push(aiTPos - 16);
      aiS3HConstraints.push(aiTPos - 2);
      board2[rngPos + p] = 1;
      aiSPlaced ++;
    }); 
  }
  render();
}

function aiShip2() {
  let ship2Arr = new Array();
  let aiDirection = aiRng(AIDIR);
  console.log(`AI ship 2 is going ` + aiDirection);
  if (aiDirection === 1) {
    for (var i = 0; i < 64; i++)
      if (!REDZONE.h7.includes(i)
        && !aiShipPos.includes(i)
        && !aiS2HConstraints.includes(i)) {
        ship2Arr.push(i);
      }
    let rngPos = aiRng(ship2Arr);
    console.log(rngPos);
    SHIPS.ship2.forEach(function(p, i) {
      let aiTPos = rngPos + p;
      aiShipPos.push(aiTPos);
      aiS3HConstraints.push(aiTPos - 1);
      aiS3VConstraints.push(aiTPos - 8);
      aiS3VConstraints.push(aiTPos - 16);
      aiS3HConstraints.push(aiTPos - 2);
      board2[rngPos + p] = 1;
      aiSPlaced ++;
    });   
  }
  if (aiDirection === -1) {
    for (var i = 0; i < 64; i++)
      if (!REDZONE.v56.includes(i)
        && !aiShipPos.includes(i)
        && !aiS2VConstraints.includes(i)) {
        ship2Arr.push(i);
      }
    let rngPos = aiRng(ship2Arr);
    console.log(rngPos);
    SHIPS.ship2v.forEach(function(p, i) {
      let aiTPos = rngPos + p;
      aiShipPos.push(aiTPos);
      aiS3HConstraints.push(aiTPos - 1);
      aiS3VConstraints.push(aiTPos - 8);
      aiS3VConstraints.push(aiTPos - 16);
      aiS3HConstraints.push(aiTPos - 2);
      board2[rngPos + p] = 1;
      aiSPlaced ++;
    }); 
  }
  render();
}

function aiShip3() {
  let ship3Arr = new Array();
  let aiDirection = aiRng(AIDIR);
  console.log(`AI ship 3 is going ` + aiDirection);
  if (aiDirection === 1) {
    for (var i = 0; i < 64; i++)
      if (!REDZONE.h7.includes(i)
        && !REDZONE.h6.includes(i)
        && !aiShipPos.includes(i)
        && !aiS2HConstraints.includes(i)
        && !aiS3HConstraints.includes(i)) {
        ship3Arr.push(i);
      }
    let rngPos = aiRng(ship3Arr);
    console.log(rngPos);
    SHIPS.ship3.forEach(function(p, i) {
      let aiTPos = rngPos + p;
      aiShipPos.push(aiTPos);
      aiS3HConstraints.push(aiTPos - 1);
      aiS3VConstraints.push(aiTPos - 8);
      aiS4HConstraints.push(aiTPos - 2);
      aiS4HConstraints.push(aiTPos - 3);
      aiS4VConstraints.push(aiTPos - 16);
      aiS4VConstraints.push(aiTPos - 24);
      board2[rngPos + p] = 1;
      aiSPlaced ++;
    });   
  }
  if (aiDirection === -1) {
    for (var i = 0; i < 64; i++)
      if (!REDZONE.v56.includes(i)
        && !aiShipPos.includes(i)
        && !REDZONE.v48.includes(i)
        && !aiS2VConstraints.includes(i)
        && !aiS3VConstraints.includes(i)) {
        ship3Arr.push(i);
      }
    let rngPos = aiRng(ship3Arr);
    console.log(rngPos);
    SHIPS.ship3v.forEach(function(p, i) {
      let aiTPos = rngPos + p;
      aiShipPos.push(aiTPos);
      aiS3HConstraints.push(aiTPos - 1);
      aiS3VConstraints.push(aiTPos - 8);
      aiS4HConstraints.push(aiTPos - 2);
      aiS4HConstraints.push(aiTPos - 3);
      aiS4VConstraints.push(aiTPos - 16);
      aiS4VConstraints.push(aiTPos - 24);
      board2[rngPos + p] = 1;
      aiSPlaced ++;
    }); 
  }
  render();
}

function aiShip4() {
  let ship4Arr = new Array();
  let aiDirection = aiRng(AIDIR);
  console.log(`AI ship 4 is going ` + aiDirection);
  if (aiDirection === 1) {
    for (var i = 0; i < 64; i++)
      if (!REDZONE.h7.includes(i)
        && !REDZONE.h6.includes(i)
        && !REDZONE.h5.includes(i)
        && !aiShipPos.includes(i)
        && !aiS2HConstraints.includes(i)
        && !aiS3HConstraints.includes(i)
        && !aiS4HConstraints.includes(i)) {
        ship4Arr.push(i);
      }
    let rngPos = aiRng(ship4Arr);
    console.log(rngPos);
    SHIPS.ship4.forEach(function(p, i) {
      let aiTPos = rngPos + p;
      aiShipPos.push(aiTPos);
      board2[rngPos + p] = 1;
      aiSPlaced ++;
    });   
  }
  if (aiDirection === -1) {
    for (var i = 0; i < 64; i++)
      if (!REDZONE.v56.includes(i)
        && !aiShipPos.includes(i)
        && !REDZONE.v48.includes(i)
        && !REDZONE.v40.includes(i)
        && !aiS4VConstraints.includes(i)
        && !aiS2VConstraints.includes(i)
        && !aiS3VConstraints.includes(i)) {
        ship4Arr.push(i);
      }
    let rngPos = aiRng(ship4Arr);
    console.log(rngPos);
    SHIPS.ship4v.forEach(function(p, i) {
      let aiTPos = rngPos + p;
      aiShipPos.push(aiTPos);
      board2[rngPos + p] = 1;
      aiSPlaced ++;
    }); 
  }
  render();
}

setTimeout (aiShip1, 100);
setTimeout (aiShip2, 200);
setTimeout (aiShip3, 300);
setTimeout (aiShip4, 400);

function startGame () {
  startsnd.play();
  if (sPlaced === SHIPSINPLAY) {
    document.querySelector('.container2').addEventListener('click', pewPew);
  } else {
    console.log('place ships');
    return;
  }
}

function pewPew(evt) {
  let target = parseInt(evt.target.id.replace('posb', ''));
    if (!posFired.includes(target) && aiShipPos.includes(target)) {
      board2[target] = 2;
      console.log('hit');
      posFired.push(target);
      hits++;
      explode.play();
      render();
      checkWinner();
      return;
    } else if (!posFired.includes(target) && !aiShipPos.includes(target)) {
      console.log('ai turn')
      board2[target] = 3;
      document.querySelector('.container2').removeEventListener('click', pewPew);
      aiTurn = true;
      posFired.push(target);
      splash.play();
      aiShootMode();
      render();
    } else if (posFired.includes(target)) {
    console.log('that spot has already been hit');
    return;
    }
}

function aiShootMode() {
  if (HARDMODE === 0) {
    aiPewPew();
  }
  if (aiMiss && HARDMODE === 1 ) {
    aiPewPew();
  }
  if (aiMiss && HARDMODE === 1 && aiHitAgain) {
    rngNextHitAgain();
  }
  if (!aiMiss && HARDMODE === 1) {
    rngNextHit();
  }
}

function rngNextHit() {
  aiHardArr = [];
  if (AIBORDERS.r0.includes(aiLastHit)
    && aiLastHit !== 0
    && aiLastHit !== 7) {
    aiHardArr.push(aiLastHit - 1);
    aiHardArr.push(aiLastHit + 1);
    aiHardArr.push(aiLastHit + 8);
    aiNextHit = aiRng(aiHardArr);
    checkNextHit(aiNextHit);
  }
  if (AIBORDERS.r56.includes(aiLastHit)
    && aiLastHit !== 56
    && aiLastHit !== 63) {
    aiHardArr.push(aiLastHit - 8);
    aiHardArr.push(aiLastHit + 1);
    aiHardArr.push(aiLastHit - 1);
    aiNextHit = aiRng(aiHardArr);
    checkNextHit(aiNextHit);
  }
  if (AIBORDERS.c0.includes(aiLastHit) 
    && aiLastHit !== 0
    && aiLastHit !== 56) {
    aiHardArr.push(aiLastHit - 8);
    aiHardArr.push(aiLastHit + 1);
    aiHardArr.push(aiLastHit + 8);
    aiNextHit = aiRng(aiHardArr);
    checkNextHit(aiNextHit);
    }
  if (AIBORDERS.c7.includes(aiLastHit)
    && aiLastHit !== 7
    && aiLastHit !== 63) {
    aiHardArr.push(aiLastHit - 8);
    aiHardArr.push(aiLastHit + 8);
    aiHardArr.push(aiLastHit - 1);
    aiNextHit = aiRng(aiHardArr);
    checkNextHit(aiNextHit);
    }
  if (aiLastHit === 0) {
    aiHardArr.push(aiLastHit + 8);
    aiHardArr.push(aiLastHit + 1);
    aiNextHit = aiRng(aiHardArr);
    checkNextHit(aiNextHit);
  }
  if (aiLastHit === 7) {
    aiHardArr.push(aiLastHit - 1);
    aiHardArr.push(aiLastHit + 8);
    aiNextHit = aiRng(aiHardArr);
    checkNextHit(aiNextHit);
  }
  if (aiLastHit === 56) {
    aiHardArr.push(aiLastHit - 8);
    aiHardArr.push(aiLastHit + 1);
    aiNextHit = aiRng(aiHardArr);
    checkNextHit(aiNextHit);
  }
  if (aiLastHit === 63) {
    aiHardArr.push(aiLastHit - 1);
    aiHardArr.push(aiLastHit - 8);
    aiNextHit = aiRng(aiHardArr);
    checkNextHit(aiNextHit);
  }
  if (!AIBORDERS.r0.includes(aiLastHit)
    && !AIBORDERS.r56.includes(aiLastHit)
    && !AIBORDERS.c0.includes(aiLastHit)
    && !AIBORDERS.c7.includes(aiLastHit)) {
    aiHardArr.push(aiLastHit - 1);
    aiHardArr.push(aiLastHit + 1);
    aiHardArr.push(aiLastHit - 8);
    aiHardArr.push(aiLastHit + 8);
    aiNextHit = aiRng(aiHardArr);
    checkNextHit(aiNextHit);
  }
}

function checkNextHit() {
  if (!aiPosFired.includes(aiNextHit)) {
    aiHardMode(aiNextHit);
    console.log('did not include > hard mode');
  }
  else if (aiPosFired.includes(aiNextHit)) {
    rngNextHitAgain();
    console.log('included hitting again');
  } else {
    console.log('else statement')
    aiHitAgain = false;
    aiShootMode();
  }
  //something here when all spots are taken
  //nexthit false
}

function rngNextHitAgain() {
  aiNextHit = aiRng(aiHardArr);
  checkNextHit(aiNextHit);
  console.log('rngNextHitAgain');
}

function aiHardMode() {
  if (shipPos.includes(aiNextHit)) {
    board[aiNextHit] = 2;
    aiHits++;
    aiPosFired.push(aiNextHit);
    aiLastHit = aiNextHit;
    console.log('ai hit again');
    console.log(aiNextHit);
    rngNextHit();
    render();
  }
  if (!shipPos.includes(aiNextHit)) {
    console.log(aiNextHit);
    console.log('ai miss next hit');
    board[aiNextHit] = 3;
    aiMiss = true;
    aiHitAgain = true;
    document.querySelector('.container2').addEventListener('click', pewPew);
    render();
    return;
  }
}

function aiPewPew() {
  let aiPewArr = new Array();
  for (var i = 0; i < 64; i++)
    if (!aiPosFired.includes(i)) {
       aiPewArr.push(i);
    }
    let rngFirePos = aiRng(aiPewArr); //random hit
    if (shipPos.includes(rngFirePos)) { //did it hit / yes
      board[rngFirePos] = 2;
      aiHits++;
      aiPosFired.push(rngFirePos);
      aiLastHit = rngFirePos;
      aiMiss = false;
      console.log('ai hit');
      console.log(rngFirePos);
      aiShootMode();
      checkWinner();
    } else {
      console.log('ai miss');
      board[rngFirePos] = 3;
      aiPosFired.push(rngFirePos);
      aiMiss = true;
      document.querySelector('.container2').addEventListener('click', pewPew);
      return;
    }
}


// function aiShip1() {
//   let aiDirection = aiRng(AIDIR);
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