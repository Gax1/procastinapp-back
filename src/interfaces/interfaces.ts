export interface CustomError extends Error {
  statusCode: number;
  publicMessage: string;
}

export interface ProtoUser {
  username: string;
  password: string;
  img: String;
}
