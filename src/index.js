const {
    renderBoard,
    renderPlayers,
    renderInvite,
    renderRemainingPathCard,
    erasePathCard,
} = require('./rendering');
const { pathCardInsertionPosition } = require('./Board');
const { initGame } = require('./gameFactory');
const { terminal: term } = require('terminal-kit');
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

function movePlayer(player, direction) {
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

term.windowTitle('Labyrinth game');
term.hideCursor();
term.eraseDisplay();

renderBoard(board);
renderPlayers(players);
renderInvite();

let currentRemainingPathCard = remainingPathCard;
let currentCardPosition = 0;
currentRemainingPathCard.x = pathCardInsertionPosition[currentCardPosition].x;
currentRemainingPathCard.y = pathCardInsertionPosition[currentCardPosition].y;
renderRemainingPathCard(currentRemainingPathCard);

term.grabInput();
term.on('key', function(key, matches, data) {
    switch (key) {
        case 'UP':
            movePlayer(players[0], Direction.NORTH);
            renderBoard(board);
            renderPlayers(players);
            break;
        case 'DOWN':
            movePlayer(players[0], Direction.SOUTH);
            renderBoard(board);
            renderPlayers(players);
            break;
        case 'LEFT':
            movePlayer(players[0], Direction.WEST);
            renderBoard(board);
            renderPlayers(players);
            break;
        case 'RIGHT':
            movePlayer(players[0], Direction.EAST);
            renderBoard(board);
            renderPlayers(players);
            break;
        case 'j':
            erasePathCard(currentRemainingPathCard);
            currentCardPosition =
                (pathCardInsertionPosition.length + currentCardPosition - 1) %
                pathCardInsertionPosition.length;
            currentRemainingPathCard.x =
                pathCardInsertionPosition[currentCardPosition].x;
            currentRemainingPathCard.y =
                pathCardInsertionPosition[currentCardPosition].y;
            renderRemainingPathCard(currentRemainingPathCard);

            break;
        case 'k':
            erasePathCard(currentRemainingPathCard);
            currentCardPosition =
                (currentCardPosition + 1) % pathCardInsertionPosition.length;
            currentRemainingPathCard.x =
                pathCardInsertionPosition[currentCardPosition].x;
            currentRemainingPathCard.y =
                pathCardInsertionPosition[currentCardPosition].y;
            renderRemainingPathCard(currentRemainingPathCard);

            break;
        case 'r':
        case 'R':
            erasePathCard(currentRemainingPathCard);
            currentRemainingPathCard.direction =
                (currentRemainingPathCard.direction + 1) % 4;
            renderRemainingPathCard(currentRemainingPathCard);

            break;
        case 'ENTER':
            erasePathCard(currentRemainingPathCard);
            currentRemainingPathCard = board.insertPathCard(
                currentRemainingPathCard
            );

            renderRemainingPathCard(currentRemainingPathCard);
            renderBoard(board);
            renderPlayers(players);

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
