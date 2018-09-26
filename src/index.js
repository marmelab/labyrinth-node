const { produce } = require('immer');
const {
    renderBoard,
    renderPlayers,
    renderInvite,
    renderRemainingPathCard,
    erasePathCard,
} = require('./rendering');

const {
    PATH_CARD_INSERTION_POSITION,
    insertPathCardIntoBoard,
} = require('./board');

const { initGame } = require('./gameFactory');
const {
    getExitDirections,
    Direction,
    rotateDirection,
    movePathCardTo,
} = require('./pathCard');
const { terminal: term } = require('terminal-kit');
const { createPlayer } = require('./player');

const NB_PLAYER = 1;
const NB_TARGET_CARD = 24;

let { board, players, remainingPathCard } = initGame(NB_PLAYER, NB_TARGET_CARD);

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
    const { x, y } = player.pathCard;
    const { x: nextX, y: nextY } = getCoordinatesForAMove(x, y, direction);
    if (
        nextX >= 0 &&
        nextX < board.length &&
        nextY >= 0 &&
        nextY < board.length
    ) {
        const pathCard = board[x][y];
        if (getExitDirections(pathCard).includes(direction)) {
            const nextPathCard = board[nextX][nextY];
            const nextPathCardExitDirections = getExitDirections(nextPathCard);
            const nextPathCardEntranceDirections = nextPathCardExitDirections.map(
                direction => rotateDirection(direction, 2)
            );
            if (nextPathCardEntranceDirections.includes(direction)) {
                // the move is possible
                return createPlayer(
                    player.color,
                    nextPathCard,
                    player.targetCards
                );
            }
        }
    }
    return player;
}

term.windowTitle('Labyrinth game');
term.hideCursor();
term.eraseDisplay();

renderBoard(board);
renderPlayers(players);
renderInvite();

let currentIndexOfPathCardInsertionPosition = 0;
remainingPathCard = movePathCardTo(
    remainingPathCard,
    PATH_CARD_INSERTION_POSITION[currentIndexOfPathCardInsertionPosition].x,
    PATH_CARD_INSERTION_POSITION[currentIndexOfPathCardInsertionPosition].y
);
renderRemainingPathCard(remainingPathCard);

term.grabInput();
term.on('key', function(key, matches, data) {
    switch (key) {
        case 'UP':
            players[0] = movePlayer(players[0], Direction.NORTH);
            renderBoard(board);
            renderPlayers(players);
            break;
        case 'DOWN':
            players[0] = movePlayer(players[0], Direction.SOUTH);
            renderBoard(board);
            renderPlayers(players);
            break;
        case 'LEFT':
            players[0] = movePlayer(players[0], Direction.WEST);
            renderBoard(board);
            renderPlayers(players);
            break;
        case 'RIGHT':
            players[0] = movePlayer(players[0], Direction.EAST);
            renderBoard(board);
            renderPlayers(players);
            break;
        case 'j':
            erasePathCard(remainingPathCard);
            currentIndexOfPathCardInsertionPosition =
                (PATH_CARD_INSERTION_POSITION.length +
                    currentIndexOfPathCardInsertionPosition -
                    1) %
                PATH_CARD_INSERTION_POSITION.length;
            remainingPathCard = movePathCardTo(
                remainingPathCard,
                PATH_CARD_INSERTION_POSITION[
                    currentIndexOfPathCardInsertionPosition
                ].x,
                PATH_CARD_INSERTION_POSITION[
                    currentIndexOfPathCardInsertionPosition
                ].y
            );
            renderRemainingPathCard(remainingPathCard);

            break;
        case 'k':
            erasePathCard(remainingPathCard);
            currentIndexOfPathCardInsertionPosition =
                (currentIndexOfPathCardInsertionPosition + 1) %
                PATH_CARD_INSERTION_POSITION.length;
            remainingPathCard = movePathCardTo(
                remainingPathCard,
                PATH_CARD_INSERTION_POSITION[
                    currentIndexOfPathCardInsertionPosition
                ].x,
                PATH_CARD_INSERTION_POSITION[
                    currentIndexOfPathCardInsertionPosition
                ].y
            );
            renderRemainingPathCard(remainingPathCard);

            break;
        case 'r':
        case 'R':
            erasePathCard(remainingPathCard);
            remainingPathCard = produce(remainingPathCard, draft => {
                draft.direction = (remainingPathCard.direction + 1) % 4;
            });
            renderRemainingPathCard(remainingPathCard);

            break;
        case 'ENTER': {
            erasePathCard(remainingPathCard);
            const {
                board: newBoard,
                pathCard: newRemainingPathCard,
            } = insertPathCardIntoBoard(board, remainingPathCard);

            renderRemainingPathCard(newRemainingPathCard);
            renderBoard(newBoard);
            renderPlayers(players);
            board = newBoard;
            remainingPathCard = newRemainingPathCard;
            break;
        }
        case 'CTRL_C':
            term.hideCursor();

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
