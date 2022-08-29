import CustomError from "../interfaces/interfaces";

const customErrorGenerator = (
  statusCode: number,
  message: string,
  publicMessage: string
) => {
  const error = new Error() as CustomError;
  error.statusCode = statusCode;
  error.message = message;
  if (publicMessage) {
    error.publicMessage = publicMessage;
  }
  return error;
};

export default customErrorGenerator;
