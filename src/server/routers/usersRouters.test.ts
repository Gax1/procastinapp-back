import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "..";
import dataBaseConnection from "../../database";
import User from "../../database/models/User";
import { hashCreator } from "../../utils/auth/authFunctions";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUrl = await mongoServer.getUri();

  await dataBaseConnection(mongoUrl);
});

beforeEach(async () => {
  const hashedPassword = await hashCreator("test-password");
  await User.create({
    username: "test-username",
    password: hashedPassword,
    img: "test-img",
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a user router register endpoint", () => {
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

      expect(body).toHaveProperty("message");
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

describe("Given a user router login endpoint", () => {
  describe("When it receives a request", () => {
    test("Then it should return a user with a token", async () => {
      const loginUser = {
        username: "test-username",
        password: "test-password",
      };

      const { body } = await request(app)
        .post("/users/login")
        .send(loginUser)
        .expect(200);

      await expect(body.user).toHaveProperty("token");
    });
  });
});

describe("Given a user router login endpoint", () => {
  describe("When it receives an incorrect request", () => {
    test("Then it should return an error", async () => {
      const wrongLogin = {
        username: "test-username",
      };

      const { body } = await request(app)
        .post("/users/login")
        .send(wrongLogin)
        .expect(403);

      await expect(body).toHaveProperty("Error");
    });
  });
});
