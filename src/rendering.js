const { Type } = require('./pathCard');
const { terminal: term } = require('terminal-kit');
const assert = require('assert').strict;

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
    if (pathCard && pathCard.type == Type.CORNER) {
        return CORNER[pathCard.direction];
    } else if (pathCard && pathCard.type == Type.STRAIGHT) {
        return STRAIGHT[pathCard.direction];
    } else if (pathCard && pathCard.type == Type.CROSS) {
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
        let cpt = 0;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const c = tile[cpt++];
                if (c == '.') {
                    term.moveTo(i + x, j + y).bgBlue(c);
                } else {
                    term.moveTo(i + x, j + y).red(c);
                }
                if (target !== null) {
                    // transforms a number 0,1,... into 'A','B',...
                    const symbol = String.fromCharCode(
                        'A'.charCodeAt(0) + target
                    );
                    term.moveTo(i + 1, j + 1).bgBlue(symbol);
                }
            }
        }
    }
}

function renderPlayers(players) {
    players.forEach(p => {
        const { x, y } = p.pathCard;
        const { i, j } = getScreenCoordinatesFromBoardPosition(x, y);
        term.moveTo(1 + i, 1 + j); // +1 for the center of the tile
        term.bgBlue[p.color]('☗');
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
    renderPathCardRepresentationAtScreenCoordinates,
    renderBoard,
    renderRemainingPathCard,
    erasePathCard,
    STRAIGHT,
    CORNER,
    CROSS,
};
