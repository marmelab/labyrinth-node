const { terminal: term } = require('terminal-kit');

const TERMINAL_HEIGHT = 35;
const TILE_SIZE = 3;

const BOARD_HEIGHT = TILE_SIZE * 7;

const PAD_X = 5;
const PAD_Y = 3;

function getScreenCoordinatesFromBoardPosition(x, y) {
    const SHIFT_Y = (TERMINAL_HEIGHT - BOARD_HEIGHT) / 2;
    const i = PAD_X + TILE_SIZE * x;
    const j = TERMINAL_HEIGHT - TILE_SIZE * y - (SHIFT_Y + PAD_Y);
    return { i, j };
}

const renderDebugInvite = (text, dy = 0) => {
    const { i, j } = getScreenCoordinatesFromBoardPosition(9, 0);
    term.eraseArea(i, j, 40, 1);

    term.moveTo(i, j + dy, 'Debug: ' + text);
};

module.exports = {
    renderDebugInvite,
};
