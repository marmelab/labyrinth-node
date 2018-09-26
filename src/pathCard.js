const { produce } = require('immer');

const Type = Object.freeze({ STRAIGHT: '┃', CORNER: '┗', CROSS: '┻' }); // pointing NORTH
const Direction = Object.freeze({
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3,
});

function rotateDirection(direction, numberOfQuaters) {
    const newDirection = (4 + direction + numberOfQuaters) % 4;
    return newDirection;
}

const defaultPathCard = {
    type: null,
    x: null,
    y: null,
    direction: Direction.NORTH,
    target: null,
};

const createPathCard = (parameters = {}) =>
    Object.assign({}, defaultPathCard, parameters);

const movePathCardTo = (card, toX, toY) =>
    produce(card, draft => {
        draft.x = toX;
        draft.y = toY;
    });

const getExitDirections = card => {
    if (card.type == Type.STRAIGHT) {
        const directions = [Direction.NORTH, Direction.SOUTH];
        return directions.map(direction =>
            rotateDirection(direction, card.direction)
        );
    } else if (card.type == Type.CORNER) {
        const directions = [Direction.NORTH, Direction.EAST];
        return directions.map(direction =>
            rotateDirection(direction, card.direction)
        );
    } else if (card.type == Type.CROSS) {
        const directions = [Direction.NORTH, Direction.EAST, Direction.WEST];
        return directions.map(direction =>
            rotateDirection(direction, card.direction)
        );
    }
};

module.exports = {
    createPathCard,
    getExitDirections,
    Type,
    Direction,
    rotateDirection,
    movePathCardTo,
};
