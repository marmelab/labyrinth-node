const { produce } = require('immer');

const createPlayer = (color, pathCard, targetCards) =>
    Object.freeze({
        color,
        pathCard,
        targetCards,
    });

const addTargetCardToPlay = (player, card) =>
    produce(player, draft => {
        draft.targetCards = player.targetCards.concat(card);
    });

module.exports = { createPlayer, addTargetCardToPlay };
