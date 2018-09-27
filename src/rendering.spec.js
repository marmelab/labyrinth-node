const {
    renderPathCardRepresentationAtScreenCoordinates,
    STRAIGHT,
    CORNER,
} = require('./rendering');

const { Direction } = require('./pathCard');

const { terminal: term } = require('terminal-kit');

jest.mock('terminal-kit', () => {
    const terminal = jest.fn(() => terminal);
    terminal.moveTo = jest.fn(() => terminal);
    terminal.red = jest.fn(() => terminal);
    terminal.bgBlue = jest.fn(() => terminal);
    terminal.bgBlack = jest.fn(() => terminal);
    terminal.bgRGB = jest.fn(() => terminal);

    return { terminal };
});

describe('check tile size', () => {
    it('should contains 9 moves', () => {
        for (let dir of Object.values(Direction)) {
            term.moveTo.mockClear();
            renderPathCardRepresentationAtScreenCoordinates(
                0,
                0,
                STRAIGHT[dir],
                null
            );
            expect(term.moveTo.mock.calls).toHaveLength(9);
        }
    });
});

describe('Straight', () => {
    it('should render a straight-north with ┃ only', () => {
        term.mockClear();
        term.bgBlue.mockClear();
        renderPathCardRepresentationAtScreenCoordinates(
            0,
            0,
            STRAIGHT[Direction.NORTH],
            null
        );
        expect(term.mock.calls).toHaveLength(6);
        expect(term.bgBlue.mock.calls).toHaveLength(3);
        // The 1st argument of i-th call to red should be '┃'
        for (let i = 0; i < 6; i++) {
            expect(term.mock.calls[i][0]).toBe('┃');
        }
    });
    it('should render a straight-east with ━ only', () => {
        term.mockClear();
        term.bgBlue.mockClear();
        renderPathCardRepresentationAtScreenCoordinates(
            0,
            0,
            STRAIGHT[Direction.EAST],
            null
        );
        expect(term.mock.calls).toHaveLength(6);
        expect(term.bgBlue.mock.calls).toHaveLength(3);
        for (let i = 0; i < 6; i++) {
            expect(term.mock.calls[i][0]).toBe('━');
        }
    });
});

describe('Corner', () => {
    it('should render a corner-north correctly', () => {
        term.mockClear();
        term.bgBlue.mockClear();
        renderPathCardRepresentationAtScreenCoordinates(
            0,
            0,
            CORNER[Direction.NORTH],
            null
        );
        expect(term.mock.calls).toHaveLength(6);
        expect(term.bgBlue.mock.calls).toHaveLength(3);
        const chars = '┃┗┃┗━━';
        for (let i = 0; i < 6; i++) {
            expect(term.mock.calls[i][0]).toBe(chars[i]);
        }
        term.mockClear();
        term.bgBlue.mockClear();
    });
});
