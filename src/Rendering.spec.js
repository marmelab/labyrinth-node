const {
    renderPathCardRepresentationAtScreenCoordinates,
    STRAIGHT,
    CORNER,
} = require('./Rendering');
const { Direction, Directions } = require('./PathCard');

class MockTerminal {
    constructor(terminal) {
        this.terminal = terminal;
        this.mockMoveTo = jest.fn((o, x, y) => o);
        this.mockColor = jest.fn((o, color, text) => o);
        this.mockBgColor = jest.fn((o, color, text) => o);
    }

    moveTo(i, j) {
        return this.mockMoveTo(this, i, j);
    }

    color(color, text) {
        return this.mockColor(this, color, text);
    }

    bgColor(color, text) {
        return this.mockBgColor(this, color, text);
    }
}

describe('check tile size', () => {
    it('should contains 9 moves', () => {
        for (let dir of Directions) {
            const mock = new MockTerminal();
            renderPathCardRepresentationAtScreenCoordinates(
                mock,
                0,
                0,
                STRAIGHT[dir],
                null
            );
            expect(mock.mockMoveTo.mock.calls).toHaveLength(9);
        }
    });
});

describe('Straight', () => {
    it('should render a straight-north with ┃ only', () => {
        const mock = new MockTerminal();
        renderPathCardRepresentationAtScreenCoordinates(
            mock,
            0,
            0,
            STRAIGHT[Direction.NORTH],
            null
        );
        expect(mock.mockColor.mock.calls).toHaveLength(6);
        expect(mock.mockBgColor.mock.calls).toHaveLength(3);
        // The 3rd argument of i-th call to mockColor should be '┃'
        for (let i = 0; i < 6; i++) {
            expect(mock.mockColor.mock.calls[i][2]).toBe('┃');
        }
    });
    it('should render a straight-east with ━ only', () => {
        const mock = new MockTerminal();
        renderPathCardRepresentationAtScreenCoordinates(
            mock,
            0,
            0,
            STRAIGHT[Direction.EAST],
            null
        );
        expect(mock.mockColor.mock.calls).toHaveLength(6);
        expect(mock.mockBgColor.mock.calls).toHaveLength(3);
        for (let i = 0; i < 6; i++) {
            expect(mock.mockColor.mock.calls[i][2]).toBe('━');
        }
    });
});

describe('Corner', () => {
    it('should render a corner-north correctly', () => {
        const mock = new MockTerminal();
        renderPathCardRepresentationAtScreenCoordinates(
            mock,
            0,
            0,
            CORNER[Direction.NORTH],
            null
        );
        expect(mock.mockColor.mock.calls).toHaveLength(6);
        expect(mock.mockBgColor.mock.calls).toHaveLength(3);
        const chars = '┃┗┃┗━━';
        for (let i = 0; i < 6; i++) {
            expect(mock.mockColor.mock.calls[i][2]).toBe(chars[i]);
        }
    });
});
