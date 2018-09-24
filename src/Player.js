const defaultPlayer = () => ({
    color: null,
    x: null,
    y: null,
    targetCards: [],
});

class Player {
    constructor(o = defaultPlayer) {
        const { x, y, color, targetCards } = Object.assign(
            {},
            defaultPlayer(),
            o
        );
        this.color = color;
        this.x = x;
        this.y = y;
        this.targetCards = targetCards;
    }

    add(card) {
        this.targetCards.push(card);
    }
}

module.exports = { Player };
