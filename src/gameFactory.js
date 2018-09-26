const { createPathCard, Type, Direction } = require('./pathCard');
const { createTargetCard } = require('./targetCard');
const { createEmptyBoard } = require('./board');
const { createPlayer, addTargetCardToPlay } = require('./player');
const { produce } = require('immer');

const buildBoard = () => {
    let targetNumber = 0;
    const pathCardToInsert = [
        // row 0
        {
            type: Type.CORNER,
            x: 0,
            y: 0,
            direction: Direction.NORTH,
        },
        {
            type: Type.CROSS,
            x: 2,
            y: 0,
            direction: Direction.NORTH,
            target: targetNumber++,
        },
        {
            type: Type.CROSS,
            x: 4,
            y: 0,
            direction: Direction.NORTH,
            target: targetNumber++,
        },
        {
            type: Type.CORNER,
            x: 6,
            y: 0,
            direction: Direction.WEST,
        },
        // row 2
        {
            type: Type.CROSS,
            x: 0,
            y: 2,
            direction: Direction.EAST,
            target: targetNumber++,
        },
        {
            type: Type.CROSS,
            x: 2,
            y: 2,
            direction: Direction.NORTH,
            target: targetNumber++,
        },
        {
            type: Type.CROSS,
            x: 4,
            y: 2,
            direction: Direction.WEST,
            target: targetNumber++,
        },
        {
            type: Type.CROSS,
            x: 6,
            y: 2,
            direction: Direction.WEST,
            target: targetNumber++,
        },
        // row 4
        {
            type: Type.CROSS,
            x: 0,
            y: 4,
            direction: Direction.EAST,
            target: targetNumber++,
        },
        {
            type: Type.CROSS,
            x: 2,
            y: 4,
            direction: Direction.EAST,
            target: targetNumber++,
        },
        {
            type: Type.CROSS,
            x: 4,
            y: 4,
            direction: Direction.SOUTH,
            target: targetNumber++,
        },
        {
            type: Type.CROSS,
            x: 6,
            y: 4,
            direction: Direction.WEST,
            target: targetNumber++,
        },
        // row 6
        {
            type: Type.CORNER,
            x: 0,
            y: 6,
            direction: Direction.EAST,
        },
        {
            type: Type.CROSS,
            x: 2,
            y: 6,
            direction: Direction.SOUTH,
            target: targetNumber++,
        },
        {
            type: Type.CROSS,
            x: 4,
            y: 6,
            direction: Direction.SOUTH,
            target: targetNumber++,
        },
        {
            type: Type.CORNER,
            x: 6,
            y: 6,
            direction: Direction.SOUTH,
        },
    ];

    const initBoardFromRow = (board, row) =>
        produce(board, draft => {
            row.forEach(card => {
                const pathCard = createPathCard(card);
                draft[pathCard.x][pathCard.y] = pathCard;
            });
        });

    let board = createEmptyBoard();
    board = initBoardFromRow(board, pathCardToInsert);

    return { board: board, targetNumber: targetNumber };
};

const buildPathDeck = initialTargetNumber => {
    const res = [];

    for (let i = 0; i < 13; i++) {
        res.push(createPathCard({ type: Type.STRAIGHT }));
    }
    for (let i = 0; i < 9; i++) {
        res.push(createPathCard({ type: Type.CORNER }));
    }

    let targetNumber = initialTargetNumber;
    for (let i = 0; i < 6; i++) {
        res.push(createPathCard({ type: Type.CORNER, target: targetNumber++ }));
    }
    for (let i = 0; i < 6; i++) {
        res.push(createPathCard({ type: Type.CROSS, target: targetNumber++ }));
    }
    return res;
};

const buildTargetDeck = maxTargetNumber =>
    Array.from({ length: maxTargetNumber }, (_, k) => createTargetCard(k));

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function initPlayers(board, nbPlayers) {
    const STARTING_POSITION_FOR_PLAYER = [
        { x: 0, y: 0, color: 'green' },
        { x: 0, y: 6, color: 'red' },
        { x: 6, y: 6, color: 'yellow' },
        { x: 6, y: 0, color: 'blue' },
    ];

    const players = Array.from({ length: nbPlayers }, (_, k) => {
        const { x, y, color } = STARTING_POSITION_FOR_PLAYER[k];
        return createPlayer(color, board[x][y], []);
    });
    return players;
}

function dealCards(players, cards) {
    const nbPlayers = players.length;
    const nbCards = cards.length;
    let newPlayers = [];
    for (let i = 0; i < nbPlayers; i++) {
        let player = players[i];
        for (let j = 0; j < nbCards / nbPlayers; j++) {
            player = addTargetCardToPlay(player, cards.pop());
        }
        newPlayers = newPlayers.concat(player);
    }
    return newPlayers;
}

const dealCardsOnBoard = (board, shuffledPathDeck) =>
    produce(board, draft => {
        board.forEach((column, x) => {
            column.forEach((cell, y) => {
                if (!cell) {
                    const pathCard = shuffledPathDeck.pop();
                    const directions = Object.values(Direction);
                    const randomDirection =
                        directions[
                            Math.floor(Math.random() * directions.length)
                        ];
                    const newPathCard = createPathCard({
                        ...pathCard,
                        direction: randomDirection,
                        x: x,
                        y: y,
                    });
                    draft[x][y] = newPathCard;
                }
            });
        });
    });

function initGame(nbPlayers, nbTargetCards) {
    const {
        board: board,
        targetNumber: numberOfTargetAlreadyOnBoard,
    } = buildBoard();

    const pathDeck = buildPathDeck(numberOfTargetAlreadyOnBoard);
    const shuffledPathDeck = shuffle(pathDeck);
    const newBoard = dealCardsOnBoard(board, shuffledPathDeck);
    const remainingPathCard = pathDeck.pop();

    const targetDeck = buildTargetDeck(nbTargetCards);
    const suffledTargetDeck = shuffle(targetDeck);

    const playersWithPathCard = initPlayers(newBoard, nbPlayers);

    const playersWithTargetCards = dealCards(
        playersWithPathCard,
        suffledTargetDeck
    );

    return {
        board: newBoard,
        players: playersWithTargetCards,
        remainingPathCard: remainingPathCard,
    };
}

module.exports = {
    initGame,
    initPlayers,
    dealCards,
    buildBoard,
    buildPathDeck,
    buildTargetDeck,
    shuffle,
};
