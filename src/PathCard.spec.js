const { PathCard, Type, Direction } = require('./PathCard');

test('PathCard constructor with default values', () => {
    const card = new PathCard();
    expect(card.type).toBeNull();
    expect(card.x).toBeNull();
    expect(card.y).toBeNull();
    expect(card.direction).toBe(Direction.NORTH);
    expect(card.target).toBeNull();
});

test('PathCard constructor with custom values', () => {
    const card = new PathCard({ type: Type.CORNER, x: 0, y: 2 });
    expect(card.type).toBe(Type.CORNER);
    expect(card.x).toBe(0);
    expect(card.y).toBe(2);
    expect(card.direction).toBe(Direction.NORTH);
    expect(card.target).toBeNull();
});

describe('check STRAIGHT exit directions', () => {
    it('should return north and south', () => {
        const card = new PathCard({
            type: Type.STRAIGHT,
            direction: Direction.NORTH,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.NORTH);
        expect(exitDirections).toContain(Direction.SOUTH);
    });
    it('should return north and south', () => {
        const card = new PathCard({
            type: Type.STRAIGHT,
            direction: Direction.SOUTH,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.NORTH);
        expect(exitDirections).toContain(Direction.SOUTH);
    });
    it('should return east and west', () => {
        const card = new PathCard({
            type: Type.STRAIGHT,
            direction: Direction.EAST,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.EAST);
        expect(exitDirections).toContain(Direction.WEST);
    });
    it('should return east and west', () => {
        const card = new PathCard({
            type: Type.STRAIGHT,
            direction: Direction.WEST,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.EAST);
        expect(exitDirections).toContain(Direction.WEST);
    });
});

describe('check CORNER exit directions', () => {
    it('should return north and east', () => {
        const card = new PathCard({
            type: Type.CORNER,
            direction: Direction.NORTH,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.NORTH);
        expect(exitDirections).toContain(Direction.EAST);
    });
    it('should return east and south', () => {
        const card = new PathCard({
            type: Type.CORNER,
            direction: Direction.EAST,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.EAST);
        expect(exitDirections).toContain(Direction.SOUTH);
    });
    it('should return south and west', () => {
        const card = new PathCard({
            type: Type.CORNER,
            direction: Direction.SOUTH,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.SOUTH);
        expect(exitDirections).toContain(Direction.WEST);
    });
    it('should return west and north', () => {
        const card = new PathCard({
            type: Type.CORNER,
            direction: Direction.WEST,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.NORTH);
        expect(exitDirections).toContain(Direction.WEST);
    });
});

describe('check CROSS exit directions', () => {
    it('should return north, east and west', () => {
        const card = new PathCard({
            type: Type.CROSS,
            direction: Direction.NORTH,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.NORTH);
        expect(exitDirections).toContain(Direction.EAST);
        expect(exitDirections).toContain(Direction.WEST);
    });
    it('should return east, north and south', () => {
        const card = new PathCard({
            type: Type.CROSS,
            direction: Direction.EAST,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.EAST);
        expect(exitDirections).toContain(Direction.NORTH);
        expect(exitDirections).toContain(Direction.SOUTH);
    });
    it('should return south, east and west', () => {
        const card = new PathCard({
            type: Type.CROSS,
            direction: Direction.SOUTH,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.SOUTH);
        expect(exitDirections).toContain(Direction.EAST);
        expect(exitDirections).toContain(Direction.WEST);
    });
    it('should return west, north and north', () => {
        const card = new PathCard({
            type: Type.CROSS,
            direction: Direction.WEST,
        });
        const exitDirections = card.exitDirections();
        expect(exitDirections).toContain(Direction.WEST);
        expect(exitDirections).toContain(Direction.NORTH);
        expect(exitDirections).toContain(Direction.SOUTH);
    });
});
