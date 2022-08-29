import customErrorGenerator from "./customErrorGenerator";

describe("Given a custom error generator function", () => {
  describe("When is called with a status code, a message and a public message", () => {
    test("Then it should return an error object with status code, message and public message properties", () => {
      const publicMessage = "Error please try again";
      const message = "Error conecting with the data base";
      const statusCode = 404;

      const error = customErrorGenerator(statusCode, message, publicMessage);

      expect(error.statusCode).toStrictEqual(statusCode);
      expect(error.publicMessage).toStrictEqual(publicMessage);
      expect(error.message).toStrictEqual(message);
    });
  });
});
