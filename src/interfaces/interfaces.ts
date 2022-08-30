import { Schema } from "mongoose";

export interface CustomError extends Error {
  statusCode: number;
  publicMessage: string;
}

export interface ProtoUser {
  username: string;
  password: string;
  img: string;
}

export interface IUser extends ProtoUser {
  id: string;
  tasks?: Schema.Types.ObjectId[];
}

export interface JwtPayload {
  id: string;
  username: string;
}

export interface LoginUser {
  username: string;
  password: string;
}
