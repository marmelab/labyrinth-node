// we use a function here to avoid sharing the empty targetCards array
const defaultPlayer = () => ({
    x: null,
    y: null,
    color: null,
    targetCards: [],
});

class Player {
    constructor(parameters = {}) {
        const { x, y, color, targetCards } = Object.assign(
            {},
            defaultPlayer(),
            parameters
        );
        //I can't use the following construct
        // { ...defaultPlayer(), ...parameters };
        // because eslint does not accept the syntax wiht my config file

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
