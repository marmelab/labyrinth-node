const { Direction } = require('./PathCard');
const term = require('terminal-kit').terminal;
const { renderBoard, STRAIGHT, CORNER, CROSS } = require('./Rendering');

const {
    buildBoard,
    buildPathDeck,
    buildTargetDeck,
    shuffle,
} = require('./GameFactory');

const { board: board, targetNumber: fixedTargetNumber } = buildBoard();

const pathDeck = shuffle(buildPathDeck(fixedTargetNumber));
for (let c of pathDeck) {
    // assign a random direction to each card of the deck
    const i = Math.floor(Math.random() * 4);
    c.direction = Direction[['NORTH', 'SOUTH', 'EAST', 'WEST'][i]];
}

for (let y = 0; y < board.size(); y++) {
    for (let x = 0; x < board.size(); x++) {
        if (!board.get(y, x)) {
            const pathCard = pathDeck.pop();
            pathCard.x = x;
            pathCard.y = y;
            board.add(pathCard);
        }
    }
}

const targetDeck = shuffle(buildTargetDeck(24));

term.windowTitle('Labyrinth game');
term.eraseDisplay();

renderBoard(board);

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
