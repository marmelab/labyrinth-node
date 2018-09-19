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
