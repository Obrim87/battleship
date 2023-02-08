let playerGameboard = Gameboard();
let computerGameboard = Gameboard();

let player = Player('Mick', playerGameboard.ships, true);
let computer = Player('Computer', computerGameboard.ships, false);

// playerGameboard.receiveAttack(player, [4,8]);
// computerGameboard.receiveAttack(computer, [5,8]);
// computerGameboard.receiveAttack(computer, [5,8]);
// playerGameboard.receiveAttack(player, [6,9]);
// computerGameboard.receiveAttack(computer, [6,9]);
// playerGameboard.receiveAttack(player, [8,5]);
// playerGameboard.receiveAttack(player, [9,5]);

PlaceShipsInDom();

function PlaceShipsInDom() { 
  let playerGrid = document.querySelectorAll('.playerGridDiv');
  let deployBtn = document.querySelector('.deployBtn');
  let consoleMessage = document.querySelector('.consoleMessage');
  let fireBtn = document.querySelector('.fireBtn');
  let xRadioBtn = document.querySelector('#x');
  let yRadioBtn = document.querySelector('#y');
  let shipIndex = 0;
  let shipType = '';
  let orientation = 'x';

  xRadioBtn.addEventListener('click', () => orientation = 'x')
  yRadioBtn.addEventListener('click', () => orientation = 'y')
  
  deployPlayerShipToGrid();
  
  deployBtn.addEventListener('click', () => {
    cycleThroughShips();
  }, { once: true })

  function cycleThroughShips() {
    let shipOrderArr = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrolBoat'];
    let shipDisplayNameArr = ['Carrier', 'Battleship', 'Destroyer', 'Submarine', 'Patrol Boat'];
    let shipLengthArr = [5, 4, 3, 3, 2];
    consoleMessage.innerText = `Please deploy your ${shipDisplayNameArr[shipIndex]} (${shipLengthArr[shipIndex]} spaces).`
    shipType = shipOrderArr[shipIndex];
    shipIndex = (shipIndex + 1) % (shipOrderArr.length);
    if (Object.keys(playerGameboard.ships).length === 5) {
      gameLoop();
      return consoleMessage.innerText = `All ships deployed, prepare for battle!`
    }
  }

  function deployPlayerShipToGrid() {
    for (let i of playerGrid) {
      i.addEventListener('mouseenter', () => i.style.background = 'lightblue');
      i.addEventListener('mouseleave', () => i.style.background = '');
      i.addEventListener('click', (e) => {
        if (!shipType) {
          return consoleMessage.innerText = `Click 'Deploy your fleet' to begin!`;
        }
        if (Object.keys(playerGameboard.ships).length === 5) {
          return;
        }
        consoleMessage.innerText = null;
        playerGameboard.shipLocation(shipType, convertIdStringToArray(e.target.id), orientation);
        if (shipType in playerGameboard.ships) {
          showShipOncePlaced(playerGameboard.ships[shipType].coordinates);
          console.log(playerGameboard.ships)
          cycleThroughShips();
        }
      }, { once: true })
    }
  }

  deployComputerShipToGrid();

  function deployComputerShipToGrid() {
    // will need to randomly generate the coords later
    computerGameboard.shipLocation('carrier', [4,8], 'x');
    computerGameboard.shipLocation('battleship', [7,2], 'y');
    computerGameboard.shipLocation('destroyer', [9,1], 'y');
    computerGameboard.shipLocation('submarine', [1,3], 'x');
    computerGameboard.shipLocation('patrolBoat', [8,5], 'x');
    console.log('computer ships ' + computerGameboard.ships);
  }

  function showShipOncePlaced(array) {
    for (let i of array) {
      for (let j of playerGrid) {
        if (i === j.id) {
          j.style.border = 'blue 3px solid';
        }
      }
    }
  }

  function convertIdStringToArray(string) {
    let array = string.split(',');
    array = array.map(Number); // converts strings to integers
    return array;
  }
}

function Player(name, shipArr, isHuman) {
  return {
    name,
    shipArr,
    isHuman: isHuman,
    previousAttacks: []
  }
}

function gameLoop() {
  console.log('test');
  let computerGrid = document.querySelectorAll('.computerGridDiv');
  for (let i of computerGrid) {
    i.addEventListener('mouseenter', () => i.style.background = 'firebrick');
    i.addEventListener('mouseleave', () => i.style.background = '');
    // i.addEventListener('click', (e) => {
      
    // }, { once: true })
  }
}

export function Ship(name, length) {
  return {
    name,
    length,
    hits: 0,
    isSunk: false,
    hit: function() {
      this.hits++;
    },
    checkSunk: function() {
      if (this.hits === this.length) {
        this.isSunk = true;
        document.querySelector('.consoleMessage').innerText = `You sunk your opponent's ${this.name}!`;
      }
    }};
}

// x = horizontal, y = vertical. x coordinate comes first

export function Gameboard() {
  let ships = {};
  let totalSunk = 0;
  let validCoordinates = [];
  let usedCoordinates = [];
  let consoleMessage = document.querySelector('.consoleMessage');


  boardCoordinates(10); // board size defined here

  function clearShipsArray() {
    ships = {};
  }

  function allShipsSunk() {
    if (totalSunk === 5) {
      return true
    }
  }

  function boardCoordinates(boardSize) {
    for (let i = 1; i <= boardSize; i++) {
      for (let j = 1; j <= boardSize; j++) {
        validCoordinates.push(`${j},${i}`);
      }
    }
  }

  function checkEntireShipIsWithinGameboard(coordArr) {
    for (let i of coordArr) {
      if (!validCoordinates.includes(i)) {
        return true;
      }
    }
  }

  function checkShipDoesNotIntersectWithOthers(coordArr) {
    for (let i of coordArr) {
      if (usedCoordinates.includes(i)) {
        return true;
      }
    }
  }

  function shipLocation(name, startCoord, axis) {
    switch (name) {
      case 'carrier':
        let carrier = Ship('carrier', 5);
        carrier.coordinates = [];
        if (axis === 'x') {
          for (let i = 0; i <= carrier.length - 1; i++) {
            carrier['coordinates'].push(`${startCoord[0] + i},${startCoord[1]}`)
          }
        }
        if (axis === 'y') {
          for (let i = 0; i <= carrier.length - 1; i++) {
            carrier['coordinates'].push(`${startCoord[0]},${startCoord[1] + i}`)
          }
        }
        if (checkEntireShipIsWithinGameboard(carrier.coordinates)) {
          return consoleMessage.innerText = `You cannot place the Carrier there, part of it is outside of the gameboard.`;
        }
        usedCoordinates.push(...carrier.coordinates);
        ships.carrier = carrier;
        return ships;
      case 'battleship':
        let battleship = Ship('battleship', 4);
        battleship.coordinates = [];
        if (axis === 'x') {
          for (let i = 0; i <= battleship.length - 1; i++) {
            battleship['coordinates'].push(`${startCoord[0] + i},${startCoord[1]}`)
          }
        }
        if (axis === 'y') {
          for (let i = 0; i <= battleship.length - 1; i++) {
            battleship['coordinates'].push(`${startCoord[0]},${startCoord[1] + i}`)
          }
        }
        if (checkEntireShipIsWithinGameboard(battleship.coordinates)) {
          return consoleMessage.innerText = `You cannot place the Battleship there, part of it is outside of the gameboard.`;
        }
        if (checkShipDoesNotIntersectWithOthers(battleship.coordinates)) {
          return consoleMessage.innerText = `You cannot place the Carrier there. There is already a vessel in that position.`;
        }
        usedCoordinates.push(...battleship.coordinates);
        ships.battleship = battleship;
        return ships;
      case 'destroyer':
        let destroyer = Ship('destroyer', 3);
        destroyer.coordinates = [];
        if (axis === 'x') {
          for (let i = 0; i <= destroyer.length - 1; i++) {
            destroyer['coordinates'].push(`${startCoord[0] + i},${startCoord[1]}`)
          }
        }
        if (axis === 'y') {
          for (let i = 0; i <= destroyer.length - 1; i++) {
            destroyer['coordinates'].push(`${startCoord[0]},${startCoord[1] + i}`)
          }
        }
        if (checkEntireShipIsWithinGameboard(destroyer.coordinates)) {
          return consoleMessage.innerText = `You cannot place the Destoyer there, part of it is outside of the gameboard.`;
        }
        if (checkShipDoesNotIntersectWithOthers(destroyer.coordinates)) {
          return consoleMessage.innerText = `You cannot place the Destroyer there. There is already a vessel in that position.`;
        }
        usedCoordinates.push(...destroyer.coordinates);
        ships.destroyer = destroyer;
        return ships;
      case 'submarine':
        let submarine = Ship('submarine', 3);
        submarine.coordinates = [];
        if (axis === 'x') {
          for (let i = 0; i <= submarine.length - 1; i++) {
            submarine['coordinates'].push(`${startCoord[0] + i},${startCoord[1]}`)
          }
        }
        if (axis === 'y') {
          for (let i = 0; i <= submarine.length - 1; i++) {
            submarine['coordinates'].push(`${startCoord[0]},${startCoord[1] + i}`)
          }
        }
        if (checkEntireShipIsWithinGameboard(submarine.coordinates)) {
          return consoleMessage.innerText = `You cannot place the Submarine there, part of it is outside of the gameboard.`;
        }
        if (checkShipDoesNotIntersectWithOthers(submarine.coordinates)) {
          return consoleMessage.innerText = `You cannot place the Submarine there. There is already a vessel in that position.`;
        }
        usedCoordinates.push(...submarine.coordinates);
        ships.submarine = submarine;
        return ships;
      case 'patrolBoat':
        let patrolBoat = Ship('patrolBoat', 2);
        patrolBoat.coordinates = [];
        if (axis === 'x') {
          for (let i = 0; i <= patrolBoat.length - 1; i++) {
            patrolBoat['coordinates'].push(`${startCoord[0] + i},${startCoord[1]}`)
          }
        }
        if (axis === 'y') {
          for (let i = 0; i <= patrolBoat.length - 1; i++) {
            patrolBoat['coordinates'].push(`${startCoord[0]},${startCoord[1] + i}`)
          }
        }
        if (checkEntireShipIsWithinGameboard(patrolBoat.coordinates)) {
          return consoleMessage.innerText = `You cannot place the Patrol Boat there, part of it is outside of the gameboard.`;
        }
        if (checkShipDoesNotIntersectWithOthers(patrolBoat.coordinates)) {
          return consoleMessage.innerText = `You cannot place the Patrol Boat there. There is already a vessel in that position.`;
        }
        usedCoordinates.push(...patrolBoat.coordinates);
        ships.patrolBoat = patrolBoat;
        return ships;
      default:
        consoleMessage.innerText = 'Invalid boat data';
    }
  }

  function receiveAttack(humanOrAi, attackCoordinates) {
    if (attackCoordinates[0] > 10 || attackCoordinates[1] > 10 || attackCoordinates[0] < 1 || attackCoordinates[1] < 1 ) {
      return consoleMessage.innerText = `You cannot attack there. The gameboard size is 10 x 10.`;
    }

    let hitArray = [];
    let coordStr = `${attackCoordinates[0]},${attackCoordinates[1]}`;
    if (humanOrAi.previousAttacks.includes(coordStr)) {
      return consoleMessage.innerText = 'You have already tried that coordinate.';
    }
    humanOrAi.previousAttacks.push(coordStr);
    for (let i in ships) {
      if (ships[i].coordinates.some(elem => elem === coordStr)) {
        consoleMessage.innerText = `That's a hit!`;
        ships[i].hit();
        ships[i].checkSunk();
        if (ships[i].isSunk) totalSunk++;
        hitArray.push(true);
      } else {
        hitArray.push(false);
      }
    }
    if (hitArray.every(elem => !elem)) {
      consoleMessage.innerText = `That's a miss! Try again.`;
    }
  }

  return {
    shipLocation,
    receiveAttack,
    clearShipsArray,
    ships
  };
};