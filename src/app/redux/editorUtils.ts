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
  wrap = false,
}: {
  currentPosition: number;
  wandLength: number;
  moveBy: number;
  wrap?: boolean;
}) => {
  const wandCapacity = wandLength + 1;
  const proposedPosition = currentPosition + moveBy;
  if (!wrap) {
    if (proposedPosition > wandLength) {
      return wandLength;
    }
    if (proposedPosition < 0) {
      return 0;
    }
  }
  return (proposedPosition + wandCapacity) % wandCapacity;
};
