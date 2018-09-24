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
        board.array.forEach(row =>
            row.forEach(cell => {
                expect(cell).not.toBeNull();
            })
        );
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

    it('should only contain target paths which are either a CORNER or a CROSS', () => {
        board.array.forEach((row, y) => {
            row.forEach((card, x) => {
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
            });
        });
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

    it("should return a deck where cards aren't in their original position", () => {
        const shuffledDeck = shuffle(deck.slice()); // shuffle a copy
        expect(shuffledDeck).not.toEqual(deck);
    });
});

describe('TargetDeck', () => {
    const nbCards = 24;
    const deck = buildTargetDeck(nbCards);

    it('should have 24 cards', () => {
        expect(deck).toHaveLength(24);
    });

    it("should return a deck where cards aren't in their original position", () => {
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

    it('should assign the green color to player 0', () => {
        expect(players[0].color).toEqual('green');
        expect(players[0].x).toBe(0);
        expect(players[0].y).toBe(0);
        expect(players[0].targetCards).toHaveLength(0);
    });
    it('should assign the red color to player 1', () => {
        expect(players[1].color).toEqual('red');
        expect(players[1].x).toBe(0);
        expect(players[1].y).toBe(6);
        expect(players[1].targetCards).toHaveLength(0);
    });
    it('should assign the yellow color to player 2', () => {
        expect(players[2].color).toEqual('yellow');
        expect(players[2].x).toBe(6);
        expect(players[2].y).toBe(6);
        expect(players[2].targetCards).toHaveLength(0);
    });
    it('should assign the blue color to player 3', () => {
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
    const { board, players, remainingPathCard } = initGame(1, 24);

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

    it('should contain 49 path cards on board', () => {
        const flattenArray = board.array.reduce(
            (acc, val) => acc.concat(val),
            []
        );
        expect(flattenArray.filter(element => element)).toHaveLength(49);
    });
});

describe('InitGame 4 players, 24 target cards', () => {
    const { players, remainingPathCard } = initGame(4, 24);
    it('should contain 4 players', () => {
        expect(players).toHaveLength(4);
    });
    it('should give 6 target cards to each player', () => {
        players.forEach(player => {
            expect(player.targetCards).toHaveLength(6);
        });
    });
    it('should contain 1 remainging path card', () => {
        expect(remainingPathCard).not.toBeNull();
        expect(remainingPathCard.type).not.toBeNull();
        expect(remainingPathCard.direction).not.toBeNull();
    });
});
