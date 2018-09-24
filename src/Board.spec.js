const { Board } = require('./Board');

describe('Board', () => {
    const board = new Board();
    // test board constructor and functions
    it('should contain 49 cells', () => {
        const flattenArray = board.array.reduce(
            (acc, val) => acc.concat(val),
            []
        );
        expect(flattenArray).toHaveLength(49);
    });

    it('should return correct size', () => {
        expect(board.size()).toBe(7);
    });
});
