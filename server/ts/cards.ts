export const newblack = () => {
  return "black card";
};

export const newwhite = () => {
  return "white card";
};

export const newhand = (length: number = 6) => {
  let hand = [];
  for (let i = 0; i < length; i++) {
    hand.push(newwhite());
  }
  return hand;
};
