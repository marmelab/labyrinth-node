const term = require('terminal-kit').terminal;
const { Type, Direction } = require('./PathCard');

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

function modelToScreen(x, y) {
    const PAD_X = 20;
    const PAD_Y = 3;

    const SIZE = 3;
    const HEIGHT = 20;
    const i = PAD_X + SIZE * x;
    const j = PAD_Y + HEIGHT - SIZE * y;
    return { i: i, j: j };
}

function renderBoard(board) {
    for (let y = 0; y < board.size(); y++) {
        for (let x = 0; x < board.size(); x++) {
            const { i, j } = modelToScreen(x, y);
            render(term, i, j, board.get(y, x));
        }
    }
}

function render(term, i, j, pathCard) {
    const terminal = new Terminal(term);
    const tile = getTile(pathCard);
    const target = pathCard ? pathCard.target : null;
    render_aux(terminal, i, j, tile, target);
}

function render_aux(terminal, i, j, tile, target) {
    if (tile) {
        let cpt = 0;
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const c = tile[cpt++];
                if (c == '.') {
                    terminal.moveTo(i + x, j + y).bgColor('blue', c);
                } else {
                    terminal.moveTo(i + x, j + y).color('red', c);
                }
                if (target !== null) {
                    // transforms a number 0,1,... into 'A','B',...
                    const symbol = String.fromCharCode(
                        'A'.charCodeAt(0) + target
                    );
                    terminal.moveTo(i + 1, j + 1).bgColor('blue', symbol);
                }
            }
        }
    }
}

class Terminal {
    constructor(terminal) {
        this.terminal = terminal;
    }
    moveTo(i, j) {
        this.terminal.moveTo(i, j);
        return this;
    }

    color(color, text) {
        switch (color) {
            case 'red':
                this.terminal.red(text);
                break;
        }
        return this;
    }

    bgColor(color, text) {
        switch (color) {
            case 'blue':
                this.terminal.bgBlue(text);
                break;
        }
        return this;
    }
}

module.exports = { render, render_aux, renderBoard, STRAIGHT, CORNER, CROSS };
