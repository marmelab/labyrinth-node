const { Direction } = require('./PathCard');
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
