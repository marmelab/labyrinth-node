const { Type } = require('./PathCard');
const { buildBoard, buildPathDeck, shuffle } = require('./GameFactory');

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
    const pathDeck = buildPathDeck(targetNumber);

    test('total number of path cards', () => {
        const expectedTotalNumberOfPathCards = 1 + board.size() * board.size();
        const numberOfCORNER = 4;
        expect(numberOfCORNER + targetNumber + pathDeck.length).toBe(
            expectedTotalNumberOfPathCards
        );
    });

    it('should contain 13 no-target straigth path cards', () => {
        expect(
            pathDeck.filter(c => c.type == Type.STRAIGHT && c.target == null)
        ).toHaveLength(13);
    });

    it('should contain 9 no-target CORNER path cards', () => {
        expect(
            pathDeck.filter(c => c.type == Type.CORNER && c.target == null)
        ).toHaveLength(9);
    });

    it('should contain 6 target CORNER path cards', () => {
        expect(
            pathDeck.filter(c => c.type == Type.CORNER && c.target !== null)
        ).toHaveLength(6);
    });

    it('should contain 6 target CROSS path cards', () => {
        expect(
            pathDeck.filter(c => c.type == Type.CROSS && c.target !== null)
        ).toHaveLength(6);
    });

    test('shuffle function', () => {
        const shuffledPathDeck = shuffle(pathDeck.slice()); // shuffle a copy
        expect(shuffledPathDeck).not.toEqual(pathDeck);
    });
});
