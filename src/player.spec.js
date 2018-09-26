const { createPlayer, addTargetCardToPlay } = require('./player');
const { createPathCard } = require('./pathCard');

describe('Intialized Player', () => {
    it('should use the given parameters, and an empty target card deck', () => {
        const pathCard = createPathCard({ x: 0, y: 0 });
        const player = createPlayer('green', pathCard, []);
        expect(player.pathCard.x).toBe(0);
        expect(player.pathCard.y).toBe(0);
        expect(player.color).toEqual('green');
        expect(player.targetCards).toEqual([]);
    });
});

describe('Add a card', () => {
    const pathCard = createPathCard({ x: 0, y: 0 });
    const player = createPlayer('green', pathCard, []);

    it('should have exactly 1 card', () => {
        const newPlayer = addTargetCardToPlay(player, 0);
        expect(newPlayer.targetCards).toHaveLength(1);
    });
    it('should have exactly 2 cards', () => {
        const newPlayer = addTargetCardToPlay(
            addTargetCardToPlay(player, 0),
            1
        );
        expect(newPlayer.targetCards).toHaveLength(2);
    });
});
