const { Type } = require('./pathCard');
const { terminal: term } = require('terminal-kit');
const {
    getCurrentTargetCard,
    getNumberOfRemainingTargetCard,
} = require('./player');

const { argv } = require('./commandLineArguments');

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

function renderBoard(board) {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board.length; x++) {
            const { i, j } = getScreenCoordinatesFromBoardPosition(x, y);
            renderPathCardAtScreenCoordinates(i, j, board[x][y]);
        }
    }
}

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

const targetNumberToChar = number =>
    String.fromCharCode('A'.charCodeAt(0) + number);

function renderPlayers(players) {
    players.forEach(p => {
        const { x, y } = p.pathCard;
        const { i, j } = getScreenCoordinatesFromBoardPosition(x, y);
        term.moveTo(1 + i, 1 + j); // +1 for the center of the tile
        term.bgBlue('☗');
    });
}

function renderInvite() {
    const { i, j } = getScreenCoordinatesFromBoardPosition(9, 6);
    term.moveTo(i, j + 0, 'j : Move Path Card Clockwise');
    term.moveTo(i, j + 1, 'k : Move Path Card Anti-Clockwise');
    term.moveTo(i, j + 2, 'R : Rotate Path Card Clockwise');
    term.moveTo(i, j + 3, 'ENTER : Insert the Path Card');
    term.moveTo(i, j + 5, '← : Move player Left');
    term.moveTo(i, j + 6, '→ : Move player Right');
    term.moveTo(i, j + 7, '↑ : Move player Up');
    term.moveTo(i, j + 8, '↓ : Move player Down');
}

function renderPlayerInvite(player, score) {
    const { i, j } = getScreenCoordinatesFromBoardPosition(9, 2);
    term.moveTo(i, j + 0, 'Player ' + player.color);
    term.moveTo(i, j + 1, 'Score: ' + score);
    term.moveTo(
        i,
        j + 2,
        'Remaining target cards: ' + getNumberOfRemainingTargetCard(player)
    );
    const targetCard = getCurrentTargetCard(player);
    term.moveTo(
        i,
        j + 3,
        'Current target card: ' + targetNumberToChar(targetCard.target)
    );
}
const renderDebugInvite = text => {
    const { i, j } = getScreenCoordinatesFromBoardPosition(9, 0);
    term.eraseArea(i, j, 50, 1);

    term.moveTo(i, j + 0, 'Debug: ' + text);
};

function renderRemainingPathCard(card) {
    const { i, j } = getScreenCoordinatesFromBoardPosition(card.x, card.y);
    renderPathCardAtScreenCoordinates(i, j, card);
}

function erasePathCard(pathCard) {
    const { i, j } = getScreenCoordinatesFromBoardPosition(
        pathCard.x,
        pathCard.y
    );
    term.eraseArea(i, j, 3, 3);
}

module.exports = {
    renderPathCardAtScreenCoordinates,
    renderPlayers,
    renderInvite,
    renderPlayerInvite,
    renderPathCardRepresentationAtScreenCoordinates,
    renderBoard,
    renderRemainingPathCard,
    erasePathCard,
    STRAIGHT,
    CORNER,
    CROSS,
    renderDebugInvite,
};
