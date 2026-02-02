import { decideWinner, nextScore } from '../../src/js/game.js';

describe('decideWinner', () => {
  test('tie when same', () => {
    expect(decideWinner('rock', 'rock')).toBe('tie');
  });
  test('rock beats scissors', () => {
    expect(decideWinner('rock', 'scissors')).toBe('player');
  });
  test('paper loses to scissors', () => {
    expect(decideWinner('paper', 'scissors')).toBe('cpu');
  });
});

describe('nextScore', () => {
  test('increments player on player win', () => {
    const s = nextScore({ player:0, cpu:0, ties:0 }, 'player');
    expect(s).toEqual({ player:1, cpu:0, ties:0 });
  });
  test('increments cpu on cpu win', () => {
    const s = nextScore({ player:0, cpu:0, ties:0 }, 'cpu');
    expect(s).toEqual({ player:0, cpu:1, ties:0 });
  });
  test('increments ties on tie', () => {
    const s = nextScore({ player:0, cpu:0, ties:0 }, 'tie');
    expect(s).toEqual({ player:0, cpu:0, ties:1 });
  });
});
