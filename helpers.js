// helper functions
const isWithinMap = (mapRadius, position) => {
    const distanceFromCenter = Math.sqrt(position.x ** 2 + position.y ** 2);
    return distanceFromCenter <= mapRadius;
};
  
const isValidMovement = (currentPos, targetPos) => {
    const dx = Math.abs(targetPos.x - currentPos.x);
    const dy = Math.abs(targetPos.y - currentPos.y);
    return dx <= 1 && dy <= 1;
};
  
  const isWithinTwoUnits = (pos1, pos2) => {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return dx <= 2 && dy <= 2;
};
  
module.exports = {
    isWithinMap,
    isValidMovement,
    isWithinTwoUnits,
};
  