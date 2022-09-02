import { createToken, hashCompare, hashCreator } from "./authFunctions";

describe("Given a hashCreator function", () => {
  describe("When its called with a text", () => {
    test("Then it should return a hash", async () => {
      const text = "testing hash";

      const result = await hashCreator(text);

      expect(result).toBeTruthy();
    });
  });
});

describe("Given a hashCompare function", () => {
  describe("When its called with a text and a hash", () => {
    test("Then it should return true", async () => {
      const text = "testing hash";
      const hash = await hashCreator(text);

      const expectedResult = await hashCompare(text, hash);

      expect(expectedResult).toBeTruthy();
    });
  });
});

describe("Given a create token function", () => {
  describe("When its called with a payload", () => {
    test("then it should create a token", async () => {
      const payload = {
        id: "testing-id",
        username: "testing-name",
      };

      const expectedToken = await createToken(payload);

      expect(expectedToken).toBeTruthy();
    });
  });
});
