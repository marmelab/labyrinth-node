const { produce } = require('immer');
const { argv } = require('./commandLineArguments');

const {
    getExitDirections,
    Direction,
    rotateDirection,
    movePathCardTo,
    getNextCoordinatesForAMove,
} = require('./pathCard');

const {
    PATH_CARD_INSERTION_POSITION,
    insertPathCardIntoBoard,
} = require('./board');

const {
    createPlayer,
    isCurrentTargetReached,
    removeTargetCardToPlay,
} = require('./player');

const {
    renderBoard,
    renderPlayers,
    renderInvite,
    renderRemainingPathCard,
    erasePathCard,
    renderPlayerInvite,
} = require('./rendering');

const { initGame } = require('./gameFactory');

const NB_PLAYER = 1;
const NB_TARGET_CARD = 24;

const createGame = () => {
    let { board, players, remainingPathCard } = initGame(
        NB_PLAYER,
        NB_TARGET_CARD
    );
    const currentIndexOfPathCardInsertionPosition = 0;
    const currentPlayerIndex = 0;
    const { x, y } = PATH_CARD_INSERTION_POSITION[
        currentIndexOfPathCardInsertionPosition
    ];
    const scores = Array.from({ length: players.length }, () => 0);
    remainingPathCard = movePathCardTo(remainingPathCard, x, y);
    return Object.freeze({
        board,
        players,
        scores,
        remainingPathCard,
        currentIndexOfPathCardInsertionPosition,
        currentPlayerIndex,
    });
};

const movePlayer = (game, direction, godMode = argv.godMode) => {
    const { board, players, scores, currentPlayerIndex } = game;
    const player = players[currentPlayerIndex];
    const { x, y } = player.pathCard;
    const { x: nextX, y: nextY } = getNextCoordinatesForAMove(x, y, direction);
    if (
        nextX >= 0 &&
        nextX < board.length &&
        nextY >= 0 &&
        nextY < board.length
    ) {
        const pathCard = board[x][y];
        if (godMode || getExitDirections(pathCard).includes(direction)) {
            const nextPathCard = board[nextX][nextY];
            const nextPathCardExitDirections = getExitDirections(nextPathCard);
            const nextPathCardEntranceDirections = nextPathCardExitDirections.map(
                rotateDirection(2)
            );
            if (godMode || nextPathCardEntranceDirections.includes(direction)) {
                // the move is possible
                const playerInNewPosition = createPlayer(
                    player.color,
                    nextPathCard,
                    player.targetCards
                );
                const score = scores[currentPlayerIndex];

                const isTargetReached = isCurrentTargetReached(
                    playerInNewPosition
                );

                const newScore = isTargetReached ? score + 1 : score;
                const newPlayer = isTargetReached
                    ? removeTargetCardToPlay(playerInNewPosition)
                    : playerInNewPosition;

                const newGame = produce(game, draft => {
                    draft.players[currentPlayerIndex] = newPlayer;
                    draft.scores[currentPlayerIndex] = newScore;
                });

                renderBoard(board);
                renderPlayers(newGame.players);
                renderPlayerInvite(newPlayer, newScore);

                return newGame;
            }
        }
    } else {
        //TODO: render impossible move
    }
    return game;
};

const moveRemainingPathCard = (game, direction) => {
    const { remainingPathCard, currentIndexOfPathCardInsertionPosition } = game;
    const numberOfPosition = PATH_CARD_INSERTION_POSITION.length;
    const toAdd = direction == Direction.WEST ? -1 : 1;
    const newIndex =
        (numberOfPosition + currentIndexOfPathCardInsertionPosition + toAdd) %
        numberOfPosition;
    const { x: newX, y: newY } = PATH_CARD_INSERTION_POSITION[newIndex];
    const newRemainingCard = movePathCardTo(remainingPathCard, newX, newY);
    const newGame = produce(game, draft => {
        draft.currentIndexOfPathCardInsertionPosition = newIndex;
        draft.remainingPathCard = newRemainingCard;
    });
    erasePathCard(remainingPathCard);
    renderRemainingPathCard(newRemainingCard);
    return newGame;
};

const moveRemainingPathCardClockwise = game =>
    moveRemainingPathCard(game, Direction.EAST);

const moveRemainingPathCardAntiClockwise = game =>
    moveRemainingPathCard(game, Direction.WEST);

const rotateRemainingPathCard = game => {
    const { remainingPathCard } = game;
    const newRemainingPathCard = produce(remainingPathCard, draft => {
        draft.direction = (remainingPathCard.direction + 1) % 4;
    });
    const newGame = produce(game, draft => {
        draft.remainingPathCard = newRemainingPathCard;
    });

    erasePathCard(remainingPathCard);
    renderRemainingPathCard(newRemainingPathCard);
    return newGame;
};

const insertRemainingPathCard = game => {
    const { board, remainingPathCard, players } = game;
    const {
        board: newBoard,
        pathCard: newRemainingPathCard,
        indexPosition: newCurrentIndexOfPathCardInsertionPosition,
    } = insertPathCardIntoBoard(board, remainingPathCard);
    const newGame = produce(game, draft => {
        draft.board = newBoard;
        draft.remainingPathCard = newRemainingPathCard;
        draft.currentIndexOfPathCardInsertionPosition = newCurrentIndexOfPathCardInsertionPosition;
    });

    erasePathCard(remainingPathCard);
    renderRemainingPathCard(newRemainingPathCard);
    renderBoard(newBoard);
    renderPlayers(players);
    return newGame;
};

const renderGame = game => {
    const {
        board,
        players,
        scores,
        currentPlayerIndex,
        remainingPathCard,
    } = game;
    renderBoard(board);
    renderRemainingPathCard(remainingPathCard);
    renderPlayers(players);
    renderInvite();
    const player = players[currentPlayerIndex];
    const score = scores[currentPlayerIndex];

    renderPlayerInvite(player, score);
};

module.exports = {
    NB_PLAYER,
    NB_TARGET_CARD,
    movePlayer,
    createGame,
    renderGame,
    moveRemainingPathCardClockwise,
    moveRemainingPathCardAntiClockwise,
    rotateRemainingPathCard,
    insertRemainingPathCard,
};
