const { Type } = require('./PathCard');
const {
    initGame,
    initPlayers,
    dealCards,
    buildBoard,
    buildPathDeck,
    buildTargetDeck,
    shuffle,
} = require('./GameFactory');

describe('Board', () => {
    const { board, targetNumber } = buildBoard();

    it('should contain NxN cells (PathCard or undefined)', () => {
        for (let y = 0; y < board.size(); y++) {
            for (let x = 0; x < board.size(); x++) {
                expect(board.get(y, x)).not.toBeNull();
            }
        }
    });

    it('should contain 4 CORNERs', () => {
        expect(board.get(0, 0).type).toBe(Type.CORNER);
        expect(board.get(0, 6).type).toBe(Type.CORNER);
        expect(board.get(6, 0).type).toBe(Type.CORNER);
        expect(board.get(6, 6).type).toBe(Type.CORNER);
    });

    it('should contain 12 target path cards', () => {
        expect(targetNumber).toBe(12);
    });

    it('each target path card should be a CORNER or a CROSS', () => {
        for (let y = 0; y < board.size(); y++) {
            for (let x = 0; x < board.size(); x++) {
                const card = board.get(y, x);
                if (x % 2 == 0 && y % 2 == 0) {
                    expect(card).not.toBeNull();
                    expect(
                        card.type == Type.CORNER || card.type == Type.CROSS
                    ).toBeTruthy();
                    expect(card.x).toBe(x);
                    expect(card.y).toBe(y);
                } else {
                    expect(card).toBeUndefined();
                }
            }
        }
    });
});

describe('PathDeck', () => {
    const { board, targetNumber } = buildBoard();
    const deck = buildPathDeck(targetNumber);

    test('total number of path cards', () => {
        const expectedTotalNumberOfPathCards = 1 + board.size() * board.size();
        const numberOfCORNER = 4;
        expect(numberOfCORNER + targetNumber + deck.length).toBe(
            expectedTotalNumberOfPathCards
        );
    });

    it('should contain 13 no-target straigth path cards', () => {
        expect(
            deck.filter(c => c.type == Type.STRAIGHT && c.target == null)
        ).toHaveLength(13);
    });

    it('should contain 9 no-target CORNER path cards', () => {
        expect(
            deck.filter(c => c.type == Type.CORNER && c.target == null)
        ).toHaveLength(9);
    });

    it('should contain 6 target CORNER path cards', () => {
        expect(
            deck.filter(c => c.type == Type.CORNER && c.target !== null)
        ).toHaveLength(6);
    });

    it('should contain 6 target CROSS path cards', () => {
        expect(
            deck.filter(c => c.type == Type.CROSS && c.target !== null)
        ).toHaveLength(6);
    });

    test('shuffle function', () => {
        const shuffledDeck = shuffle(deck.slice()); // shuffle a copy
        expect(shuffledDeck).not.toEqual(deck);
    });
});

describe('TargetDeck', () => {
    const nbCards = 24;
    const deck = buildTargetDeck(nbCards);

    test('total number of cards', () => {
        expect(deck).toHaveLength(24);
    });

    test('shuffle function', () => {
        const shuffledDeck = shuffle(deck.slice()); // shuffle a copy
        expect(shuffledDeck).not.toEqual(deck);
    });
});

describe('InitPlayers with 1 player', () => {
    const players = initPlayers(1);

    it('should contain 1 player', () => {
        expect(players).toHaveLength(1);
    });

    it('should be green and be in (0,0)', () => {
        expect(players[0].color).toEqual('green');
        expect(players[0].x).toBe(0);
        expect(players[0].y).toBe(0);
        expect(players[0].targetCards).toHaveLength(0);
    });
});

describe('InitPlayers with 4 player', () => {
    const players = initPlayers(4);

    it('should contain 4 players', () => {
        expect(players).toHaveLength(4);
    });

    test('player 0 should be green', () => {
        expect(players[0].color).toEqual('green');
        expect(players[0].x).toBe(0);
        expect(players[0].y).toBe(0);
        expect(players[0].targetCards).toHaveLength(0);
    });
    test('player 1 should be red', () => {
        expect(players[1].color).toEqual('red');
        expect(players[1].x).toBe(0);
        expect(players[1].y).toBe(6);
        expect(players[1].targetCards).toHaveLength(0);
    });
    test('player 2 should be yellow', () => {
        expect(players[2].color).toEqual('yellow');
        expect(players[2].x).toBe(6);
        expect(players[2].y).toBe(6);
        expect(players[2].targetCards).toHaveLength(0);
    });
    test('player 3 should be blue', () => {
        expect(players[3].color).toEqual('blue');
        expect(players[3].x).toBe(6);
        expect(players[3].y).toBe(0);
        expect(players[3].targetCards).toHaveLength(0);
    });
});

describe('Deal cards ', () => {
    it('should deal 24 cards to 1 player', () => {
        const nbPlayers = 1;
        const nbCards = 24;
        const players = initPlayers(nbPlayers);
        const deck = buildTargetDeck(nbCards);
        expect(players).toHaveLength(nbPlayers);
        expect(deck).toHaveLength(nbCards);

        dealCards(players, deck);
        expect(players[0].targetCards).toHaveLength(nbCards / nbPlayers);
    });

    it('should deal 12 cards to 2 players', () => {
        const nbPlayers = 2;
        const nbCards = 24;
        const players = initPlayers(nbPlayers);
        const deck = buildTargetDeck(nbCards);
        expect(players).toHaveLength(nbPlayers);
        expect(deck).toHaveLength(nbCards);

        dealCards(players, deck);
        expect(players[0].targetCards).toHaveLength(nbCards / nbPlayers);
    });
});

describe('InitGame 1 player, 24 target cards', () => {
    const { players, remainingPathCard } = initGame(1, 24);

    it('should contain 1 player', () => {
        expect(players).toHaveLength(1);
    });

    it('should give 24 target cards to player 1', () => {
        expect(players[0].targetCards).toHaveLength(24);
    });

    it('should contain 1 remainging path card', () => {
        expect(remainingPathCard).not.toBeNull();
        expect(remainingPathCard.type).not.toBeNull();
        expect(remainingPathCard.direction).not.toBeNull();
    });
});

describe('InitGame 4 players, 24 target cards', () => {
    const { players, remainingPathCard } = initGame(4, 24);
    it('should contain 4 players', () => {
        expect(players).toHaveLength(4);
    });
    it('should give 6 target cards to each player', () => {
        for (let i = 0; i < 4; i++) {
            expect(players[i].targetCards).toHaveLength(6);
        }
    });
    it('should contain 1 remainging path card', () => {
        expect(remainingPathCard).not.toBeNull();
        expect(remainingPathCard.type).not.toBeNull();
        expect(remainingPathCard.direction).not.toBeNull();
    });
});
