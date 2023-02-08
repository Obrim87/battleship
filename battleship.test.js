import { Ship, Gameboard } from './battleship.js';

test('test Ship hit method in Ship factory', () => {
  let ship = Ship('test', 3);
  ship.hit();
  expect(ship.hits).toEqual(1);
});

test('test Ship isSunk method in Ship factory', () => {
  let ship = Ship('test', 1);
  ship.hit();
  ship.checkSunk();
  expect(ship.isSunk).toBe(true);
});

test('test placeShip method in Gameboard factory', () => {
  let test = Gameboard();
  expect(test.placeShip('Carrier')).toHaveProperty('name', 'Carrier');
  expect(test.placeShip('Carrier')).toHaveProperty('length', 5);
  expect(test.placeShip('Carrier')).toHaveProperty('hits', 0);
  expect(test.placeShip('Carrier')).toHaveProperty('isSunk', false);
  expect(test.placeShip('Carrier', [1,1], 'x')).toHaveProperty('coordinates', [[1,1], [2,1], [3,1], [4,1], [5,1]]);
});

