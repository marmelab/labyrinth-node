const {
    renderBoard,
    renderPlayers,
    renderInvite,
    renderRemainingPathCard,
    erasePathCard,
} = require('./rendering');
const { pathCardInsertionPosition } = require('./Board');
const { initGame } = require('./gameFactory');
const { getTerminal } = require('./terminal');
const { Direction, rotateDirection } = require('./PathCard');

const NB_PLAYER = 1;
const NB_TARGET_CARD = 24;
const { board, players, remainingPathCard } = initGame(
    NB_PLAYER,
    NB_TARGET_CARD
);

function getCoordinatesForAMove(x, y, direction) {
    switch (direction) {
        case Direction.NORTH:
            return { x: x, y: y + 1 };
        case Direction.SOUTH:
            return { x: x, y: y - 1 };
        case Direction.EAST:
            return { x: x + 1, y: y };
        case Direction.WEST:
            return { x: x - 1, y: y };
    }
}

function movePlayer(term, player, direction) {
    const { x, y } = player;

    const { x: nextX, y: nextY } = getCoordinatesForAMove(x, y, direction);
    if (
        nextX >= 0 &&
        nextX < board.size() &&
        nextY >= 0 &&
        nextY < board.size()
    ) {
        const pathCard = board.get(y, x);

        if (pathCard.exitDirections().includes(direction)) {
            const nextPathCard = board.get(nextY, nextX);
            const nextPathCardExitDirections = nextPathCard.exitDirections();
            const nextPathCardEntranceDirections = nextPathCardExitDirections.map(
                direction => rotateDirection(direction, 2)
            );
            if (nextPathCardEntranceDirections.includes(direction)) {
                // the move is possible
                player.x = nextX;
                player.y = nextY;
            }
        }
    }
}

const term = getTerminal();

term.windowTitle('Labyrinth game');
term.hideCursor();
term.eraseDisplay();

renderBoard(term, board);
renderPlayers(term, players);
renderInvite(term);

let currentRemainingPathCard = remainingPathCard;
let currentCardPosition = 0;
currentRemainingPathCard.x = pathCardInsertionPosition[currentCardPosition].x;
currentRemainingPathCard.y = pathCardInsertionPosition[currentCardPosition].y;
renderRemainingPathCard(term, currentRemainingPathCard);

term.grabInput();
term.on('key', function(key, matches, data) {
    switch (key) {
        case 'UP':
            movePlayer(term, players[0], Direction.NORTH);
            renderBoard(term, board);
            renderPlayers(term, players);
            break;
        case 'DOWN':
            movePlayer(term, players[0], Direction.SOUTH);
            renderBoard(term, board);
            renderPlayers(term, players);
            break;
        case 'LEFT':
            movePlayer(term, players[0], Direction.WEST);
            renderBoard(term, board);
            renderPlayers(term, players);
            break;
        case 'RIGHT':
            movePlayer(term, players[0], Direction.EAST);
            renderBoard(term, board);
            renderPlayers(term, players);
            break;
        case 'j':
            erasePathCard(term, currentRemainingPathCard);
            currentCardPosition =
                (pathCardInsertionPosition.length + currentCardPosition - 1) %
                pathCardInsertionPosition.length;
            currentRemainingPathCard.x =
                pathCardInsertionPosition[currentCardPosition].x;
            currentRemainingPathCard.y =
                pathCardInsertionPosition[currentCardPosition].y;
            renderRemainingPathCard(term, currentRemainingPathCard);

            break;
        case 'k':
            erasePathCard(term, currentRemainingPathCard);
            currentCardPosition =
                (currentCardPosition + 1) % pathCardInsertionPosition.length;
            currentRemainingPathCard.x =
                pathCardInsertionPosition[currentCardPosition].x;
            currentRemainingPathCard.y =
                pathCardInsertionPosition[currentCardPosition].y;
            renderRemainingPathCard(term, currentRemainingPathCard);

            break;
        case 'r':
        case 'R':
            erasePathCard(term, currentRemainingPathCard);
            currentRemainingPathCard.direction =
                (currentRemainingPathCard.direction + 1) % 4;
            renderRemainingPathCard(term, currentRemainingPathCard);

            break;
        case 'ENTER':
            erasePathCard(term, currentRemainingPathCard);
            currentRemainingPathCard = board.insertPathCard(
                currentRemainingPathCard
            );

            renderRemainingPathCard(term, currentRemainingPathCard);
            renderBoard(term, board);
            renderPlayers(term, players);

            break;
        case 'CTRL_C':
            term.showCursor();

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
