const { produce } = require('immer');
const { movePathCardTo } = require('./pathCard');

const BOARD_SIZE = 7;

const PATH_CARD_INSERTION_POSITION = Object.freeze([
    { x: 1, y: -1 },
    { x: 3, y: -1 },
    { x: 5, y: -1 },
    { x: 7, y: 1 },
    { x: 7, y: 3 },
    { x: 7, y: 5 },
    { x: 5, y: 7 },
    { x: 3, y: 7 },
    { x: 1, y: 7 },
    { x: -1, y: 5 },
    { x: -1, y: 3 },
    { x: -1, y: 1 },
]);

const createEmptyBoard = () =>
    produce({}, () =>
        Array.from({ length: BOARD_SIZE }, () =>
            Array.from({ length: BOARD_SIZE }, () => 0)
        )
    );
const flattenBoard = board => board.reduce((acc, val) => acc.concat(val), []);

const isOnInsertionPosition = pathCard =>
    PATH_CARD_INSERTION_POSITION.some(
        position => position.x == pathCard.x && position.y == pathCard.y
    );

const putCardOnBoard = (board, toX, toY, card) => {
    board[toX][toY] = movePathCardTo(card, toX, toY);
};

const shiftRowLeft = (board, y, pathCardToInsert) =>
    produce(board, draft => {
        for (let i = 0; i < BOARD_SIZE - 1; i++) {
            putCardOnBoard(draft, i, y, board[i + 1][y]);
        }
        putCardOnBoard(draft, BOARD_SIZE - 1, y, pathCardToInsert);
    });

const shiftColumnUp = (board, x, pathCardToInsert) =>
    produce(board, draft => {
        for (let j = 0; j < BOARD_SIZE - 1; j++) {
            putCardOnBoard(draft, x, j + 1, board[x][j]);
        }
        putCardOnBoard(draft, x, 0, pathCardToInsert);
    });

const shiftColumnDown = (board, x, pathCardToInsert) =>
    produce(board, draft => {
        for (let j = 0; j < BOARD_SIZE - 1; j++) {
            putCardOnBoard(draft, x, j, board[x][j + 1]);
        }
        putCardOnBoard(draft, x, BOARD_SIZE - 1, pathCardToInsert);
    });

const shiftRowRight = (board, y, pathCardToInsert) =>
    produce(board, draft => {
        for (let i = 0; i < BOARD_SIZE - 1; i++) {
            putCardOnBoard(draft, i + 1, y, board[i][y]);
        }
        putCardOnBoard(draft, 0, y, pathCardToInsert);
    });

const getIndexPosition = (x, y) => {
    return PATH_CARD_INSERTION_POSITION.findIndex(
        pair => pair.x == x && pair.y == y
    );
};

const insertPathCardIntoBoard = (board, pathCard) => {
    if (!isOnInsertionPosition(pathCard)) {
        return { board: board, pathCard: pathCard };
    }
    const { x, y } = pathCard;
    if (x < 0) {
        const newX = BOARD_SIZE;
        const newY = y;
        const extractedPathCard = board[newX - 1][newY];
        return {
            board: shiftRowRight(board, y, pathCard),
            pathCard: movePathCardTo(extractedPathCard, newX, newY),
            indexPosition: getIndexPosition(newX, newY),
        };
    }
    if (x >= BOARD_SIZE) {
        const newX = -1;
        const newY = y;
        const extractedPathCard = board[newX + 1][newY];
        return {
            board: shiftRowLeft(board, y, pathCard),
            pathCard: movePathCardTo(extractedPathCard, newX, newY),
            indexPosition: getIndexPosition(newX, newY),
        };
    }
    if (y < 0) {
        const newX = x;
        const newY = BOARD_SIZE;
        const extractedPathCard = board[newX][newY - 1];
        return {
            board: shiftColumnUp(board, x, pathCard),
            pathCard: movePathCardTo(extractedPathCard, newX, newY),
            indexPosition: getIndexPosition(newX, newY),
        };
    }
    if (y >= BOARD_SIZE) {
        const newX = x;
        const newY = -1;
        const extractedPathCard = board[newX][newY + 1];
        return {
            board: shiftColumnDown(board, x, pathCard),
            pathCard: movePathCardTo(extractedPathCard, newX, newY),
            indexPosition: getIndexPosition(newX, newY),
        };
    }
};

module.exports = {
    createEmptyBoard,
    insertPathCardIntoBoard,
    PATH_CARD_INSERTION_POSITION,
    flattenBoard,
};
