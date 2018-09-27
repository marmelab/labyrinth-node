const { terminal: term } = require('terminal-kit');

const {
    movePlayer,
    createGame,
    renderGame,
    moveRemainingPathCardClockwise,
    moveRemainingPathCardAntiClockwise,
    rotateRemainingPathCard,
    insertRemainingPathCard,
} = require('./game');

const { Direction } = require('./pathCard');

const { argv, help, debug } = require('./commandLineArguments');

if (help()) {
    console.log('Labyrinth game options:');
    console.log('  [--help|-h]');
    console.log('  [--debug]');
    console.log('  [--godMode]');
    console.log('  [--bicolor]');
    process.exit();
}

if (Object.keys(argv).length > 1) {
    const options = Object.keys(argv).slice(1);
    term.windowTitle('Labyrinth game [' + options + ']');
} else {
    term.windowTitle('Labyrinth game');
}

term.hideCursor();
term.eraseDisplay();

let game = createGame();
renderGame(game);

term.grabInput();
term.on('key', function(key, matches, data) {
    switch (key) {
        case 'UP':
            game = movePlayer(game, Direction.NORTH);
            break;
        case 'DOWN':
            game = movePlayer(game, Direction.SOUTH);
            break;
        case 'LEFT':
            game = movePlayer(game, Direction.WEST);
            break;
        case 'RIGHT':
            game = movePlayer(game, Direction.EAST);
            break;
        case 'j':
            game = moveRemainingPathCardClockwise(game);
            break;
        case 'k':
            game = moveRemainingPathCardAntiClockwise(game);
            break;
        case 'r':
        case 'R':
            game = rotateRemainingPathCard(game);
            break;
        case 'ENTER': {
            game = insertRemainingPathCard(game);
            break;
        }
        case 'CTRL_C':
            term.hideCursor();
            term.processExit();
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

module.exports = { debug };
