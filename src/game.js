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
    BOARD_SIZE,
    PATH_CARD_INSERTION_POSITION,
    isInsertionPosition,
    putCardOnBoard,
    getIndexPosition,
} = require('./board');

const {
    isCurrentTargetReached,
    removeTargetCardToPlay,
    getNumberOfRemainingTargetCard,
    movePlayerTo,
    moveAllPlayers,
    putPlayersBackOnBoard,
} = require('./player');

const {
    renderBoard,
    renderPlayers,
    renderInvite,
    renderRemainingPathCard,
    erasePathCard,
    renderPlayerInvite,
    renderGameOver,
} = require('./rendering');

const { EVENT, STATE } = require('./constants');

const { initGame } = require('./gameFactory');

const NB_PLAYER = 1;
const NB_TARGET_CARD = 1; //24;

const createGame = () => {
    let { board, players, remainingPathCard } = initGame(NB_PLAYER, NB_TARGET_CARD);
    const currentIndexOfPathCardInsertionPosition = 0;
    const { x, y } = PATH_CARD_INSERTION_POSITION[currentIndexOfPathCardInsertionPosition];
    const newBoard = produce(board, draft => {
        putCardOnBoard(draft, x, y, remainingPathCard);
    });
    const game = Object.freeze({
        board: newBoard,
        players,
        scores: Array.from({ length: players.length }, () => 0),
        remainingPathCard: movePathCardTo(remainingPathCard, x, y),
        currentIndexOfPathCardInsertionPosition,
        currentPlayerIndex: 0,
        state: STATE.TO_INSERT,
    });
    return game;
};

const handleEvent = (game, event) => {
    let newGame = game;

    if (game.state === STATE.TO_MOVE) {
        if (event === EVENT.UP) {
            newGame = movePlayer(game, Direction.NORTH);
        } else if (event === EVENT.DOWN) {
            newGame = movePlayer(game, Direction.SOUTH);
        } else if (event === EVENT.LEFT) {
            newGame = movePlayer(game, Direction.WEST);
        } else if (event === EVENT.RIGHT) {
            newGame = movePlayer(game, Direction.EAST);
        } else if (event === EVENT.VALIDATE) {
            const gameWithNewScores = increasePlayerScoreIfOnTarget(game);
            newGame = produce(gameWithNewScores, draft => {
                draft.state = STATE.TO_INSERT;
            });
        }
    } else if (game.state === STATE.TO_INSERT) {
        if (event === EVENT.UP || event === EVENT.LEFT) {
            newGame = moveRemainingPathCardAntiClockwise(game);
        } else if (event === EVENT.DOWN || event === EVENT.RIGHT) {
            newGame = moveRemainingPathCardClockwise(game);
        } else if (event === EVENT.ROTATE) {
            newGame = rotateRemainingPathCard(game);
        } else if (event === EVENT.VALIDATE) {
            newGame = insertRemainingPathCard(game);
            newGame = produce(newGame, draft => {
                draft.state = STATE.TO_MOVE;
            });
        }
        erasePathCard(game.remainingPathCard);
        renderRemainingPathCard(newGame);
    } else if (game.state === STATE.END) {
        // game over
    }

    if (endOfGame(newGame)) {
        newGame = produce(newGame, draft => {
            draft.state = STATE.END;
        });
        renderGameOver(newGame);
    } else {
        renderBoard(newGame);
        renderPlayers(newGame);
        renderInvite(newGame);
        renderPlayerInvite(newGame);
    }
    return newGame;
};

const endOfGame = ({ players, currentPlayerIndex }) =>
    getNumberOfRemainingTargetCard(players[currentPlayerIndex]) === 0;

const increasePlayerScoreIfOnTarget = game => {
    const { board, players, scores, currentPlayerIndex } = game;
    const player = players[currentPlayerIndex];
    const score = scores[currentPlayerIndex];
    const isTargetReached = isCurrentTargetReached(player, board);
    const newScore = isTargetReached ? score + 1 : score;
    const newPlayer = isTargetReached ? removeTargetCardToPlay(player) : player;
    return produce(game, draft => {
        draft.players[currentPlayerIndex] = newPlayer;
        draft.scores[currentPlayerIndex] = newScore;
    });
};

const movePlayer = (game, direction, godMode = argv.godMode) => {
    const { board, players, currentPlayerIndex } = game;
    const player = players[currentPlayerIndex];
    const { x, y } = player;
    const { x: nextX, y: nextY } = getNextCoordinatesForAMove(x, y, direction);
    if (nextX >= 0 && nextX < board.length && nextY >= 0 && nextY < board.length) {
        if (godMode || getExitDirections(board[x][y]).includes(direction)) {
            const nextPathCard = board[nextX][nextY];
            const nextPathCardEntranceDirections = getExitDirections(nextPathCard).map(rotateDirection(2));
            if (godMode || nextPathCardEntranceDirections.includes(direction)) {
                // the move is possible
                return produce(game, draft => {
                    draft.players[currentPlayerIndex] = movePlayerTo(player, nextX, nextY);
                });
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
    const toAdd = direction === Direction.WEST ? 1 : -1;
    const newIndex = (numberOfPosition + currentIndexOfPathCardInsertionPosition + toAdd) % numberOfPosition;
    const { x: newX, y: newY } = PATH_CARD_INSERTION_POSITION[newIndex];
    const newRemainingCard = movePathCardTo(remainingPathCard, newX, newY);
    return produce(game, draft => {
        draft.currentIndexOfPathCardInsertionPosition = newIndex;
        draft.remainingPathCard = newRemainingCard;
    });
};

const moveRemainingPathCardClockwise = game => moveRemainingPathCard(game, Direction.EAST);

const moveRemainingPathCardAntiClockwise = game => moveRemainingPathCard(game, Direction.WEST);

const rotateRemainingPathCard = game => {
    const { remainingPathCard } = game;
    const newRemainingPathCard = produce(remainingPathCard, draft => {
        draft.direction = (remainingPathCard.direction + 1) % 4;
    });
    return produce(game, draft => {
        draft.remainingPathCard = newRemainingPathCard;
    });
};

const shiftColumnDown = (game, x) => {
    let newGame = game;
    for (let j = 0; j < 6; j++) {
        newGame = movePathCardAndPlayer({
            game: newGame,
            fromX: x,
            fromY: j + 1,
            toX: x,
            toY: j,
        });
    }
    return produce(newGame, draft => {
        putCardOnBoard(draft.board, x, 6, game.remainingPathCard);
    });
};

const shiftColumnUp = (game, x) => {
    let newGame = game;
    for (let j = 5; j >= 0; j--) {
        newGame = movePathCardAndPlayer({
            game: newGame,
            fromX: x,
            fromY: j,
            toX: x,
            toY: j + 1,
        });
    }
    return produce(newGame, draft => {
        putCardOnBoard(draft.board, x, 0, game.remainingPathCard);
    });
};

const shiftRowLeft = (game, y) => {
    let newGame = game;
    for (let i = 0; i < 6; i++) {
        newGame = movePathCardAndPlayer({
            game: newGame,
            fromX: i + 1,
            fromY: y,
            toX: i,
            toY: y,
        });
    }
    return produce(newGame, draft => {
        putCardOnBoard(draft.board, BOARD_SIZE - 1, y, game.remainingPathCard);
    });
};

const shiftRowRight = (game, y) => {
    let newGame = game;
    for (let i = 5; i >= 0; i--) {
        newGame = movePathCardAndPlayer({
            game: newGame,
            fromX: i,
            fromY: y,
            toX: i + 1,
            toY: y,
        });
    }
    return produce(newGame, draft => {
        putCardOnBoard(draft.board, 0, y, game.remainingPathCard);
    });
};

const movePathCardAndPlayer = ({ game, fromX, fromY, toX, toY }) =>
    produce(game, draft => {
        draft.board[toX][toY] = movePathCardTo(game.board[fromX][fromY], toX, toY);
        const { players } = game;
        draft.players = moveAllPlayers({
            players,
            fromX,
            fromY,
            toX,
            toY,
        });
    });

const doShift = ({ game, shiftFunction, fromX, fromY, toX, toY, fixed }) => {
    const { players } = game;
    const extractedPathCard = game.board[fromX][fromY];

    const newGame = shiftFunction(game, fixed);
    const newGame2 = produce(newGame, draft => {
        draft.remainingPathCard = movePathCardTo(extractedPathCard, toX, toY);
        draft.players = moveAllPlayers({
            players,
            fromX,
            fromY,
            toX,
            toY,
        });
        draft.currentIndexOfPathCardInsertionPosition = getIndexPosition({
            x: toX,
            y: toY,
        });
    });
    return putPlayersBackOnBoard(newGame2);
};

const insertRemainingPathCard = game => {
    const {
        remainingPathCard: { x, y },
    } = game;

    if (!isInsertionPosition({ x, y })) {
        return game;
    }

    if (x < 0) {
        return doShift({
            game,
            shiftFunction: shiftRowRight,
            fromX: 6,
            fromY: y,
            toX: 7,
            toY: y,
            fixed: y,
        });
    }
    if (x >= BOARD_SIZE) {
        return doShift({
            game,
            shiftFunction: shiftRowLeft,
            fromX: 0,
            fromY: y,
            toX: -1,
            toY: y,
            fixed: y,
        });
    }
    if (y < 0) {
        return doShift({
            game,
            shiftFunction: shiftColumnUp,
            fromX: x,
            fromY: 6,
            toX: x,
            toY: 7,
            fixed: x,
        });
    }
    if (y >= BOARD_SIZE) {
        return doShift({
            game,
            shiftFunction: shiftColumnDown,
            fromX: x,
            fromY: 0,
            toX: x,
            toY: -1,
            fixed: x,
        });
    }
};
module.exports = {
    NB_PLAYER,
    NB_TARGET_CARD,
    movePlayer,
    createGame,
    moveRemainingPathCardClockwise,
    moveRemainingPathCardAntiClockwise,
    rotateRemainingPathCard,
    insertRemainingPathCard,
    handleEvent,
};
