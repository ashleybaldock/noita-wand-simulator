export const clampCursorPosition = ({
  proposedPosition,
  wandLength,
}: {
  proposedPosition: number;
  wandLength: number;
  moveBy: number;
}) => {
  return Math.min(Math.max(0, proposedPosition), wandLength + 1);
};

export const getNewCursorPosition = ({
  currentPosition,
  wandLength,
  moveBy,
}: {
  currentPosition: number;
  wandLength: number;
  moveBy: number;
}) => {
  const wandCapacity = wandLength + 1;
  const proposedPosition = currentPosition + moveBy;
  return (proposedPosition + wandCapacity) % wandCapacity;
};
