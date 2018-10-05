const { Type } = require('./pathCard');
const { terminal: term } = require('terminal-kit');
const { getCurrentTargetCard, getNumberOfRemainingTargetCard } = require('./player');

const { argv } = require('./commandLineArguments');
const { STATE } = require('./constants');

const TERMINAL_HEIGHT = 35;
const TERMINAL_WIDTH = 80;
const TILE_SIZE = 3;

const BOARD_HEIGHT = TILE_SIZE * 7;
const BOARD_WIDTH = TILE_SIZE * 7;

const PAD_X = 5;
const PAD_Y = 3;

// 0 1 2 3 corresponds to NORTH, EAST, SOUTH, WEST
const CORNER = ['┃.┗┃..┗━━', '┏━━┃..┃.┏', '━━┓..┃┓.┃', '┛.┃..┃━━┛'];
const STRAIGHT = ['┃.┃┃.┃┃.┃', '━━━...━━━', '┃.┃┃.┃┃.┃', '━━━...━━━'];
const CROSS = ['┛.┗...━━━', '┃.┗┃..┃.┏', '━━━...┓.┏', '┛.┃..┃┓.┃'];

function getTile(pathCard) {
    if (pathCard && pathCard.type === Type.CORNER) {
        return CORNER[pathCard.direction];
    } else if (pathCard && pathCard.type === Type.STRAIGHT) {
        return STRAIGHT[pathCard.direction];
    } else if (pathCard && pathCard.type === Type.CROSS) {
        return CROSS[pathCard.direction];
    }
    return null;
}

function getScreenCoordinatesFromBoardPosition(x, y) {
    const SHIFT_Y = (TERMINAL_HEIGHT - BOARD_HEIGHT) / 2;
    const i = PAD_X + TILE_SIZE * x;
    const j = TERMINAL_HEIGHT - TILE_SIZE * y - (SHIFT_Y + PAD_Y);
    return { i, j };
}

const renderGame = game => {
    renderBoard(game);
    renderRemainingPathCard(game);
    renderPlayers(game);
    renderInvite(game);
    renderPlayerInvite(game);
};

const renderBoard = ({ board }) => {
    board.forEach((column, x) => {
        column.forEach((cell, y) => {
            const { i, j } = getScreenCoordinatesFromBoardPosition(x, y);
            renderPathCardAtScreenCoordinates(i, j, cell);
        });
    });
};

const erasePathCard = ({ x, y }) => {
    const { i, j } = getScreenCoordinatesFromBoardPosition(x, y);
    term.eraseArea(i, j, 3, 3);
};

const renderPathCard = pathCard => {
    const { x, y } = pathCard;
    const { i, j } = getScreenCoordinatesFromBoardPosition(x, y);
    renderPathCardAtScreenCoordinates(i, j, pathCard);
};

const renderRemainingPathCard = ({ remainingPathCard }) => renderPathCard(remainingPathCard);

function renderPathCardAtScreenCoordinates(i, j, pathCard) {
    const tile = getTile(pathCard);
    const target = pathCard ? pathCard.target : null;
    renderPathCardRepresentationAtScreenCoordinates(i, j, tile, target);
}

function renderPathCardRepresentationAtScreenCoordinates(i, j, tile, target) {
    if (tile) {
        let tileIndex = 0;
        const bgColor = (i / 3 + j / 3) % 2 === 0;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const c = tile[tileIndex++];
                if (c === '.') {
                    term.moveTo(i + x, j + y).bgBlue(c);
                } else {
                    if (!argv.bicolor || bgColor) {
                        term.moveTo(i + x, j + y);
                        term.red(true);
                        term.bgBlack(true);
                        term(c);
                        term.bgBlack(false);
                        term.red(false);
                    } else {
                        term.moveTo(i + x, j + y);
                        term.red(true);
                        term.bgColorRgb(47, 79, 79, true); // dark grey bg
                        term(c);
                        term.bgColorRgb(47, 79, 79, false);
                        term.red(false);
                    }
                }
                if (target !== null) {
                    const symbol = targetNumberToChar(target);
                    term.moveTo(i + 1, j + 1).bgBlue(symbol);
                }
            }
        }
    }
}

const targetNumberToChar = number => String.fromCharCode('A'.charCodeAt(0) + number);

const renderPlayers = ({ players }) => {
    players.forEach(({ x, y }) => {
        const { i, j } = getScreenCoordinatesFromBoardPosition(x, y);
        term.moveTo(1 + i, 1 + j); // +1 for the center of the tile
        term.bgBlue('☗');
    });
};

const renderInvite = ({ state }) => {
    const { i, j } = getScreenCoordinatesFromBoardPosition(9, 6);
    term.eraseArea(i, j, 40, 8);
    if (state === STATE.TO_MOVE) {
        term.moveTo(i, j + 0, '←, →, ↑, ↓: to move player');
        term.moveTo(i, j + 1, 'ENTER:      to validate');
    } else if (state === STATE.TO_INSERT) {
        term.moveTo(i, j + 0, '→, ↓ : to move path card clockwise');
        term.moveTo(i, j + 1, '←, ↑ : to move path card anti-clockwise');
        term.moveTo(i, j + 2, 'r, R : to rotate path card');
        term.moveTo(i, j + 3, 'ENTER : to insert the path card');
    }
};

const renderPlayerInvite = ({ currentPlayerIndex, players, scores, state: gameState }) => {
    const player = players[currentPlayerIndex];
    const score = scores[currentPlayerIndex];

    const { i, j } = getScreenCoordinatesFromBoardPosition(9, 2);
    const actionToPrint = gameState === STATE.TO_MOVE ? 'please MOVE your pawn' : 'please INSERT a path card';

    term.eraseArea(i, j + 0, 40, 4);
    term.moveTo(i, j + 0, 'Player ' + player.color + ', ' + actionToPrint);
    term.moveTo(i, j + 1, 'Score: ' + score);
    term.moveTo(i, j + 2, 'Remaining target cards: ' + getNumberOfRemainingTargetCard(player));
    const targetCard = getCurrentTargetCard(player);
    term.moveTo(i, j + 3, 'Current target card: ' + targetNumberToChar(targetCard.target));
};

const renderGameOver = ({ players, scores }) => {
    const { i, j } = getScreenCoordinatesFromBoardPosition(9, 2);
    term.eraseArea(i, j + 0, 40, 5);
    term.moveTo(i, j + 0, 'GAME OVER');
    players.forEach((player, y) => {
        term.moveTo(i, j + 1 + y, 'Player ' + players[y].color + ' has score: ' + scores[y]);
    });
};

module.exports = {
    renderPathCardAtScreenCoordinates,
    renderPlayers,
    renderInvite,
    renderPlayerInvite,
    renderPathCardRepresentationAtScreenCoordinates,
    renderBoard,
    renderGame,
    renderPathCard,
    renderRemainingPathCard,
    erasePathCard,
    STRAIGHT,
    CORNER,
    CROSS,
    renderGameOver,
};
