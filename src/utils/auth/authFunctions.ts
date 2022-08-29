import bcrypt from "bcrypt";

const hashCreator = (text: string) => {
  const salt: number = 10;
  return bcrypt.hash(text, salt);
};

export default hashCreator;
