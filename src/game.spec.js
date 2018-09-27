const { Direction } = require('./pathCard');

const { getCurrentTargetCard } = require('./player');

const { searchTargetCard } = require('./gameFactory');

const { movePlayer, createGame } = require('./game');

const { terminal: term } = require('terminal-kit');

jest.mock('terminal-kit', () => {
    const terminal = jest.fn(() => terminal);
    terminal.moveTo = jest.fn(() => terminal);
    terminal.red = jest.fn(() => terminal);
    terminal.bgBlue = jest.fn(() => terminal);
    terminal.bgBlack = jest.fn(() => terminal);
    terminal.bgRGB = jest.fn(() => terminal);
    return { terminal };
});

describe('Game movePlayer', () => {
    const game = createGame();

    const { board, players, scores, currentPlayerIndex } = game;
    const player = players[currentPlayerIndex];
    const score = scores[currentPlayerIndex];

    const targetCard = getCurrentTargetCard(player);
    const { x: targetX, y: targetY } = searchTargetCard(board, targetCard);
    const { x: playerX, y: playerY } = player.pathCard;

    it('should start with a null score', () => {
        expect(score).toBe(0);
    });
    it('should not be on the target', () => {
        expect(playerX === targetX && playerY === targetY).toBeFalsy();
    });

    it('should increase score when target is reached', () => {
        // TODO: add tests
        let { x, y } = { x: playerX, y: playerY };
        const godMode = true;
        let newScore = score;
        if (searchTargetCard(board, targetCard)) {
            let currentGame = game;
            if (x === targetX && y === targetY) {
                expect(newScore).toBe(score + 1);
            } else if (x < targetX) {
                currentGame = movePlayer(currentGame, Direction.EAST, godMode);
            } else if (x > targetX) {
                currentGame = movePlayer(currentGame, Direction.WEST, godMode);
            } else if (y < targetY) {
                currentGame = movePlayer(currentGame, Direction.NORTH, godMode);
            } else if (y > targetY) {
                currentGame = movePlayer(currentGame, Direction.SOUTH, godMode);
            }
        }
    });
});
