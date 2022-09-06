import { verifyToken } from "./authFunctions";

const mockJwtPayload = { id: "", iat: 1512341253 };

const mockVerify = jest.fn().mockReturnValue(mockJwtPayload);

jest.mock("jsonwebtoken", () => ({
  verify: (token: string) => mockVerify(token),
}));

describe("Given a create token function", () => {
  describe("When its called with a token", () => {
    test("Then it should return a string", () => {
      const tokenVerified = verifyToken("token");

      expect(mockVerify).toHaveBeenCalledWith("token");
      expect(tokenVerified).toBe(mockJwtPayload);
    });
  });
});
