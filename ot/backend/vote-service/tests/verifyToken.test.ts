import { verifyToken } from "../src/middleware/auth";
import {
  mockGetUser,
  mockEq,
  mockSingle,
} from "../tests/__mocks__/@supabase/supabase-js";

describe("verifyToken middleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = { header: jest.fn(), body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should return 401 if no token is provided", async () => {
    req.header.mockReturnValue(undefined);

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Access denied, no token provided",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 if token format is invalid", async () => {
    req.header.mockReturnValue("InvalidToken");

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ msg: "Invalid token format" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if supabase getUser fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    req.header.mockReturnValue("Bearer validtoken");
    mockGetUser.mockResolvedValue({
      data: null,
      error: new Error("Invalid token"),
    });

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ msg: "Invalid or expired token" });
    expect(next).not.toHaveBeenCalled();

    consoleSpy.mockRestore(); // Restaurar después
  });

  it("should return 404 if user not found in DB", async () => {
    req.header.mockReturnValue("Bearer validtoken");

    mockGetUser.mockResolvedValue({
      data: { user: { id: "123" } },
      error: null,
    });

    mockEq.mockReturnThis();
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "User not found" },
    });

    await verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ msg: "User not found" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() and attach user on success", async () => {
    req.header.mockReturnValue("Bearer validtoken");
    mockGetUser.mockResolvedValue({
      data: { user: { id: "123" } },
      error: null,
    });

    const mockUser = { id: "123", email: "test@example.com" };

    mockEq.mockReturnThis();
    mockSingle.mockResolvedValue({
      data: mockUser,
      error: null,
    });

    await verifyToken(req, res, next);

    expect(req.body.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
  });
});
