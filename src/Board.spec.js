const { Board } = require('./Board');

describe('Board', () => {
    const board = new Board();
    // test board constructor and functions
    it('should initialize its value properly', () => {
        Array.from(board.array, x => expect(x).toEqual([]));
    });

    it('should return correct size', () => {
        expect(board.size()).toBe(7);
    });
});
