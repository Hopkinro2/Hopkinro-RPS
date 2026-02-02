import { describe, test, expect, beforeEach, vi } from 'vitest';
import { saveSettings, loadSettings, getHighscores, setHighscores } from '../../src/js/settings.js';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
};

// Set up localStorage mock before each test
beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

describe('saveSettings', () => {
  test('saves settings object to localStorage as JSON string', () => {
    const settings = {
      name: 'TestPlayer',
      avatar: 'knight',
      difficulty: 'normal',
      theme: 'dark'
    };

    saveSettings(settings);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'game.settings',
      JSON.stringify(settings)
    );
  });

  test('handles empty settings object', () => {
    const settings = {};

    saveSettings(settings);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'game.settings',
      '{}'
    );
  });
});

describe('loadSettings', () => {
  test('returns parsed settings object when valid JSON exists', () => {
    const settings = {
      name: 'TestPlayer',
      avatar: 'wizard',
      difficulty: 'hard',
      theme: 'light'
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(settings));

    const result = loadSettings();

    expect(localStorageMock.getItem).toHaveBeenCalledWith('game.settings');
    expect(result).toEqual(settings);
  });

  test('returns null when no settings exist', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const result = loadSettings();

    expect(localStorageMock.getItem).toHaveBeenCalledWith('game.settings');
    expect(result).toBeNull();
  });

  test('returns null when invalid JSON exists', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');

    const result = loadSettings();

    expect(localStorageMock.getItem).toHaveBeenCalledWith('game.settings');
    expect(result).toBeNull();
  });

  test('returns null when empty string exists', () => {
    localStorageMock.getItem.mockReturnValue('');

    const result = loadSettings();

    expect(localStorageMock.getItem).toHaveBeenCalledWith('game.settings');
    expect(result).toBeNull();
  });
});

describe('getHighscores', () => {
  test('returns parsed highscores array when valid JSON exists', () => {
    const highscores = [
      { name: 'Player1', score: 100, date: '2024-01-01' },
      { name: 'Player2', score: 85, date: '2024-01-02' }
    ];

    localStorageMock.getItem.mockReturnValue(JSON.stringify(highscores));

    const result = getHighscores();

    expect(localStorageMock.getItem).toHaveBeenCalledWith('game.highscores');
    expect(result).toEqual(highscores);
  });

  test('returns empty array when no highscores exist', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const result = getHighscores();

    expect(localStorageMock.getItem).toHaveBeenCalledWith('game.highscores');
    expect(result).toEqual([]);
  });

  test('returns empty array when invalid JSON exists', () => {
    localStorageMock.getItem.mockReturnValue('invalid json');

    const result = getHighscores();

    expect(localStorageMock.getItem).toHaveBeenCalledWith('game.highscores');
    expect(result).toEqual([]);
  });

  test('returns empty array when empty string exists', () => {
    localStorageMock.getItem.mockReturnValue('');

    const result = getHighscores();

    expect(localStorageMock.getItem).toHaveBeenCalledWith('game.highscores');
    expect(result).toEqual([]);
  });
});

describe('setHighscores', () => {
  test('saves highscores array to localStorage as JSON string', () => {
    const highscores = [
      { name: 'Player1', score: 100, date: '2024-01-01' },
      { name: 'Player2', score: 85, date: '2024-01-02' }
    ];

    setHighscores(highscores);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'game.highscores',
      JSON.stringify(highscores)
    );
  });

  test('handles empty highscores array', () => {
    const highscores = [];

    setHighscores(highscores);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'game.highscores',
      '[]'
    );
  });

  test('handles single highscore object', () => {
    const highscores = [{ name: 'Player1', score: 100, date: '2024-01-01' }];

    setHighscores(highscores);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'game.highscores',
      JSON.stringify(highscores)
    );
  });
});
