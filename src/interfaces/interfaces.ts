interface CustomError extends Error {
  statusCode: number;
  publicMessage: string;
}

export default CustomError;
