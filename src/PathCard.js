const Type = Object.freeze({ STRAIGHT: '|', CORNER: 'L', CROSS: 'T' });
const Direction = Object.freeze({
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3,
});
const Directions = [
    Direction.NORTH,
    Direction.EAST,
    Direction.SOUTH,
    Direction.WEST,
];

/*
 * we consider that:
 *   direction of corner L is north (i.e vertical bar is pointing upwards)
 *   direction of straith | is north
 *   direction of cross T is south (i.e. vertical bar is pointing downwards)
 */

const defaultPathCard = {
    type: null,
    x: null,
    y: null,
    direction: Direction.NORTH,
    target: null,
};

class PathCard {
    constructor(o = defaultPathCard) {
        const { type, x, y, direction, target } = Object.assign(
            {},
            defaultPathCard,
            o
        );

        this.type = type;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.target = target;
    }

    toString() {
        return `${this.type} direction:${this.direction} x:${this.x} y:${
            this.y
        } ${this.target ? 'target:' + this.target : ''}`;
    }
}

module.exports = { PathCard, Type, Direction, Directions };
