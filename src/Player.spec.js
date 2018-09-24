const { Player } = require('./Player');

describe('Default Player', () => {
    it('should initialize its value properly', () => {
        const player = new Player();
        expect(player.x).toBeNull();
        expect(player.y).toBeNull();
        expect(player.color).toBeNull();
        expect(player.targetCards).toEqual([]);
        expect(player.targetCards).toHaveLength(0);
    });
});

describe('Intialized Player', () => {
    it('should initialize its value properly', () => {
        const player = new Player({ x: 0, y: 0, color: 'green' });
        expect(player.x).toBe(0);
        expect(player.y).toBe(0);
        expect(player.color).toEqual('green');
        expect(player.targetCards).toEqual([]);
    });
});

describe('Add a card', () => {
    const player = new Player({ x: 0, y: 0, color: 'green' });

    it('should have exactly 1 card', () => {
        player.add(0);
        expect(player.targetCards).toHaveLength(1);
    });
    it('should have exactly 2 cards', () => {
        player.add(0);
        expect(player.targetCards).toHaveLength(2);
    });
});
