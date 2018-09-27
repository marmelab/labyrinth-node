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

const removeTargetCardToPlay = player =>
    produce(player, draft => {
        draft.targetCards.pop();
    });

const getNumberOfRemainingTargetCard = player => player.targetCards.length;

const getCurrentTargetCard = player =>
    player.targetCards.length
        ? player.targetCards[player.targetCards.length - 1]
        : null;

const isCurrentTargetReached = player =>
    player.pathCard.target == getCurrentTargetCard(player).target;

module.exports = {
    createPlayer,
    addTargetCardToPlay,
    removeTargetCardToPlay,
    getCurrentTargetCard,
    getNumberOfRemainingTargetCard,
    isCurrentTargetReached,
};
