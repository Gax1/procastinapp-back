import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "..";
import dataBaseConnection from "../../database";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUrl = mongoServer.getUri();

  await dataBaseConnection(mongoUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a register router", () => {
  describe("When it receives a request", () => {
    test("Then it shold return a status 201 and a json with a new user", async () => {
      const user = {
        username: "supertest-name",
        password: "supertest-password",
        img: "supertest-img",
      };

      const { body } = await request(app)
        .post("/users/register")
        .send(user)
        .expect(201);

      expect(body.user).toHaveProperty("username");
    });
  });
});

describe("Given a register router", () => {
  describe("When it recevies a wrong request", () => {
    test("Then it should return an error", async () => {
      const errorUser = {
        username: "wrong-user",
      };

      const expectedError = "Error in the server, please try again later";

      const { body } = await request(app)
        .post("/users/register")
        .send(errorUser)
        .expect(400);

      expect(body.Error).toStrictEqual(expectedError);
    });
  });
});
