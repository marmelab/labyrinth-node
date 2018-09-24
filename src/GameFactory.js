const { PathCard, Type, Direction, Directions } = require('./PathCard');
const { TargetCard } = require('./TargetCard');
const { Board } = require('./Board');
const { Player } = require('./Player');

const buildBoard = () => {
    const board = new Board();

    let targetNumber = 0;
    const row0 = [
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
    ];
    row0.forEach(card => board.add(new PathCard(card)));

    const row2 = [
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
    ];
    row2.forEach(card => board.add(new PathCard(card)));

    const row4 = [
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
    ];
    row4.forEach(card => board.add(new PathCard(card)));

    const row6 = [
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
    row6.forEach(card => board.add(new PathCard(card)));

    return { board: board, targetNumber: targetNumber };
};

const buildPathDeck = initialTargetNumber => {
    const res = [];

    for (let i = 0; i < 13; i++) {
        res.push(new PathCard({ type: Type.STRAIGHT }));
    }
    for (let i = 0; i < 9; i++) {
        res.push(new PathCard({ type: Type.CORNER }));
    }

    let targetNumber = initialTargetNumber;
    for (let i = 0; i < 6; i++) {
        res.push(new PathCard({ type: Type.CORNER, target: targetNumber++ }));
    }
    for (let i = 0; i < 6; i++) {
        res.push(new PathCard({ type: Type.CROSS, target: targetNumber++ }));
    }
    return res;
};

const buildTargetDeck = maxTargetNumber =>
    Array.from({ length: maxTargetNumber }, (_, k) => new TargetCard(k));

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function initPlayers(nbPlayers) {
    const POS_COLOR = [
        { x: 0, y: 0, color: 'green' },
        { x: 0, y: 6, color: 'red' },
        { x: 6, y: 6, color: 'yellow' },
        { x: 6, y: 0, color: 'blue' },
    ];

    const players = Array.from(
        { length: nbPlayers },
        (_, k) => new Player(POS_COLOR[k])
    );
    return players;
}

function dealCards(players, cards) {
    const nbPlayers = players.length;
    const nbCards = cards.length;

    for (let i = 0; i < nbPlayers; i++) {
        for (let j = 0; j < nbCards / nbPlayers; j++) {
            players[i].add(cards.pop());
        }
    }
}

function dealCardsOnBoard(board, shuffledPathDeck) {
    shuffledPathDeck.forEach(card => {
        card.direction =
            Directions[Math.floor(Math.random() * Directions.length)];
    });

    board.array.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (!cell) {
                const pathCard = shuffledPathDeck.pop();
                pathCard.x = x;
                pathCard.y = y;
                board.add(pathCard);
            }
        });
    });
}

function initGame(nbPlayers, nbTargetCards) {
    const {
        board: board,
        targetNumber: numberOfTargetAlreadyOnBoard,
    } = buildBoard();

    const pathDeck = buildPathDeck(numberOfTargetAlreadyOnBoard);
    const shuffledPathDeck = shuffle(pathDeck);

    dealCardsOnBoard(board, shuffledPathDeck);

    const remainingPathCard = pathDeck.pop();

    const targetDeck = buildTargetDeck(nbTargetCards);
    const suffledTargetDeck = shuffle(targetDeck);

    const players = initPlayers(nbPlayers);

    dealCards(players, suffledTargetDeck);

    return {
        board: board,
        players: players,
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
