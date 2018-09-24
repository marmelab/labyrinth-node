const { Type } = require('./PathCard');

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

// we introduce this abstract layer to mock a term from terminal-kit
class AbstractTerminal {
    constructor(terminal) {
        this.terminal = terminal;
    }
    moveTo(i, j) {
        this.terminal.moveTo(i, j);
        return this;
    }

    color(color, text) {
        this.terminal[color](text);
        return this;
    }

    bgColor(color, text) {
        this.terminal[color](text);
        return this;
    }
}

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

function renderBoard(term, board) {
    for (let y = 0; y < board.size(); y++) {
        for (let x = 0; x < board.size(); x++) {
            const { i, j } = getScreenCoordinatesFromBoardPosition(x, y);
            renderPathCardAtScreenCoordinates(term, i, j, board.get(y, x));
        }
    }
}

function renderPathCardAtScreenCoordinates(term, i, j, pathCard) {
    const abstractTerminal = new AbstractTerminal(term);
    const tile = getTile(pathCard);
    const target = pathCard ? pathCard.target : null;
    renderPathCardRepresentationAtScreenCoordinates(
        abstractTerminal,
        i,
        j,
        tile,
        target
    );
}

function renderPathCardRepresentationAtScreenCoordinates(
    abstractTerminal,
    i,
    j,
    tile,
    target
) {
    if (tile) {
        let cpt = 0;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const c = tile[cpt++];
                if (c == '.') {
                    abstractTerminal.moveTo(i + x, j + y).bgColor('bgBlue', c);
                } else {
                    abstractTerminal.moveTo(i + x, j + y).color('red', c);
                }
                if (target !== null) {
                    // transforms a number 0,1,... into 'A','B',...
                    const symbol = String.fromCharCode(
                        'A'.charCodeAt(0) + target
                    );
                    abstractTerminal
                        .moveTo(i + 1, j + 1)
                        .bgColor('bgBlue', symbol);
                }
            }
        }
    }
}

function renderPlayers(term, players) {
    players.forEach(p => {
        const { i, j } = getScreenCoordinatesFromBoardPosition(p.x, p.y);
        term.moveTo(1 + i, 1 + j); // +1 for the middle
        term.bgBlue[p.color]('△');
    });
}

function renderInvite(term) {
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

function renderRemainingPathCard(term, card) {
    const { i, j } = getScreenCoordinatesFromBoardPosition(card.x, card.y);
    renderPathCardAtScreenCoordinates(term, i, j, card);
}

function erasePathCard(term, pathCard) {
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
