const { Direction } = require('./PathCard');
const term = require('terminal-kit').terminal;
const {
    renderBoard,
    renderPlayers,
    STRAIGHT,
    CORNER,
    CROSS,
} = require('./Rendering');
const { Player } = require('./Player');
const { initGame } = require('./GameFactory');

const NB_PLAYER = 1;
const NB_TARGET_CARD = 24;
const { board, players, remainingPathCard } = initGame(
    NB_PLAYER,
    NB_TARGET_CARD
);

term.windowTitle('Labyrinth game');
term.eraseDisplay();

renderBoard(term, board);
renderPlayers(term, players);

term.grabInput();
term.on('key', function(key, matches, data) {
    switch (key) {
        case 'UP':
            term.up(1);
            break;
        case 'DOWN':
            term.down(1);
            break;
        case 'LEFT':
            term.left(1);
            break;
        case 'RIGHT':
            term.right(1);
            break;
        case 'CTRL_C':
            process.exit();
            break;
        default:
            // Echo anything else
            term.noFormat(
                Buffer.isBuffer(data.code)
                    ? data.code
                    : String.fromCharCode(data.code)
            );
            break;
    }
});
