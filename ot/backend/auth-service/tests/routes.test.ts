// tests/userRoutes.test.ts
import request from "supertest";
import express from "express";
import router from "../src/routes/auth";
import {
  createUser,
  authLogin,
  updateUserById,
  getUserByAuthId,
} from "../src/models/Auth";

jest.mock("../src/models/Auth");
jest.mock("../src/middleware/auth", () => ({
  verifyToken: jest.fn((req, res, next) => {
    req.body.user = {
      id: "user1",
      email: "user@example.com",
      username: "testuser",
    };
    next();
  }),
}));
jest.mock("../src/utils/logger", () => ({
  logRequest: jest.fn(),
}));

global.fetch = jest.fn();

describe("User routes", () => {
  const app = express();
  app.use(express.json());
  app.use(router);

  describe("POST /register", () => {
    it("should return 201 if user is registered successfully", async () => {
      const mockCreateUser = createUser as jest.Mock;
      mockCreateUser.mockResolvedValue("user-id");

      (fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true }) // Kong consumer
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ key: "api-key" }),
        }); // API key

      const res = await request(app).post("/register").send({
        username: "alice",
        email: "alice@example.com",
        password: "pass123",
      });

      expect(res.status).toBe(201);
      expect(res.body.msg).toBe("User registered successfully");
      expect(res.body.user_id).toBe("user-id");
      expect(res.body.apiKey).toBe("api-key");
    });

    it("should return 500 if Kong consumer fails", async () => {
      const mockCreateUser = createUser as jest.Mock;
      mockCreateUser.mockResolvedValue("user-id");

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Server error",
      });

      const res = await request(app).post("/register").send({
        username: "alice",
        email: "alice@example.com",
        password: "pass123",
      });

      expect(res.status).toBe(500);
      expect(res.body.msg).toMatch(/Error al crear el consumer en Kong/);
    });
  });

  describe("POST /login", () => {
    it("should return 200 and token if login successful", async () => {
      const mockAuthLogin = authLogin as jest.Mock;
      const mockGetUserByAuthId = getUserByAuthId as jest.Mock;

      mockAuthLogin.mockResolvedValue({
        user: { id: "u1" },
        session: { access_token: "token123" },
      });

      mockGetUserByAuthId.mockResolvedValue({
        id: "u1",
        email: "alice@example.com",
        username: "alice",
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [{ key: "api-key" }],
        }),
      });

      const res = await request(app).post("/login").send({
        email: "alice@example.com",
        password: "pass123",
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBe("token123");
      expect(res.body.apiKey).toBe("api-key");
      expect(res.body.user.email).toBe("alice@example.com");
    });

    it("should return 500 if API key not found", async () => {
      const mockAuthLogin = authLogin as jest.Mock;
      const mockGetUserByAuthId = getUserByAuthId as jest.Mock;

      mockAuthLogin.mockResolvedValue({
        user: { id: "u1" },
        session: { access_token: "token123" },
      });

      mockGetUserByAuthId.mockResolvedValue({
        id: "u1",
        email: "alice@example.com",
        username: "alice",
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      });

      const res = await request(app).post("/login").send({
        email: "alice@example.com",
        password: "pass123",
      });

      expect(res.status).toBe(500);
      expect(res.body.msg).toMatch(/No API key found/);
    });
  });

  describe("GET /user", () => {
    it("should return 200 and user if token is valid", async () => {
      const res = await request(app).get("/user");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        id: "user1",
        email: "user@example.com",
        username: "testuser",
      });
    });
  });

  describe("PUT /user", () => {
    it("should return 200 if user is updated successfully", async () => {
      const mockUpdateUserById = updateUserById as jest.Mock;
      mockUpdateUserById.mockResolvedValue(undefined);

      const res = await request(app).put("/user").send({
        username: "newname",
        avatar_url: "avatar.png",
      });

      expect(res.status).toBe(200);
      expect(res.body.msg).toBe("User updated");
    });
  });
});
