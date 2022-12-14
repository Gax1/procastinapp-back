import { Request } from "express";
import { ObjectId, Schema } from "mongoose";
import { JwtPayload as Jwt } from "jsonwebtoken";

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

export interface BodyType {
  message: string;
  path: [string];
  type: string;
  context: {
    label: string;
    value: string;
    key: string;
  };
}

export interface ErrorValidate {
  name: string;
  message: string;
  statusCode: number;
  error: string;
  details: {
    body: BodyType[];
  };
}

export interface CustomRequest extends Request {
  payload: Jwt;
}

export interface Task {
  title: string;
  description: string;
  importance: string;
  date: string;
  img: string;
  backUpImg?: string;
  owner: ObjectId;
}
