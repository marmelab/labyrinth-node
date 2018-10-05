const { terminal: term } = require('terminal-kit');
const { createGame, handleEvent } = require('./game');
const { renderGame } = require('./rendering');
const { EVENT, STATE } = require('./constants');
const { argv, help, debug } = require('./commandLineArguments');

if (help()) {
    console.log('Labyrinth game options:');
    console.log('  [--help|-h]');
    console.log('  [--debug]');
    console.log('  [--godMode]');
    console.log('  [--bicolor]');
    console.log('  [--nogui: do not render the game]');

    process.exit();
}

if (Object.keys(argv).length > 1) {
    const options = Object.keys(argv).slice(1);
    term.windowTitle('Labyrinth game [' + options + ']');
} else {
    term.windowTitle('Labyrinth game');
}

let game = createGame();

if (!argv.nogui) {
    term.hideCursor();
    term.eraseDisplay();
    renderGame(game);

    term.grabInput();
    term.on('key', function(key, matches, data) {
        if (game.state === STATE.END) {
            term.hideCursor();
            term.processExit();
        }

        switch (key) {
            case 'UP':
                game = handleEvent(game, EVENT.UP);
                break;
            case 'DOWN':
                game = handleEvent(game, EVENT.DOWN);
                break;
            case 'LEFT':
                game = handleEvent(game, EVENT.LEFT);
                break;
            case 'RIGHT':
                game = handleEvent(game, EVENT.RIGHT);
                break;
            case 'r':
            case 'R':
                game = handleEvent(game, EVENT.ROTATE);
                break;
            case 'ENTER':
                game = handleEvent(game, EVENT.VALIDATE);
                break;
            case 'CTRL_C':
                term.hideCursor();
                term.processExit();
                break;
            default:
                // Echo anything else
                term.noFormat(Buffer.isBuffer(data.code) ? data.code : String.fromCharCode(data.code));
                break;
        }
    });
}
module.exports = { debug };
