import request from "supertest";
import express from "express";
import router from "../src/routes/users";
import { getAllUsers, deleteUser } from "../src/models/Users";
import * as authMiddleware from "../src/middleware/auth";

jest.mock("../src/models/Users");
jest.mock("../src/middleware/auth");

const verifyTokenMock = jest.mocked(authMiddleware.verifyToken);

describe("User routes", () => {
  const app = express();
  app.use(express.json());
  app.use(router);

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("GET /all users route", () => {
    it("should return all users when admin", async () => {
      verifyTokenMock.mockImplementation((req, res, next) => {
        req.body.user = { id: "user1", admin: true };
        next();
      });

      const mockGetAllUsers = getAllUsers as jest.Mock;
      mockGetAllUsers.mockResolvedValue([
        { id: "u1", username: "alice", created_at: "2024-01-01" },
        { id: "u2", username: "bob", created_at: "2024-02-01" },
      ]);

      const res = await request(app).get("/all");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { id: "u1", username: "alice", created_at: "2024-01-01" },
        { id: "u2", username: "bob", created_at: "2024-02-01" },
      ]);
    });

    it("should filter users by username", async () => {
      const mockGetAllUsers = getAllUsers as jest.Mock;
      mockGetAllUsers.mockResolvedValue([
        { id: "u1", username: "alice", created_at: "2024-01-01" },
        { id: "u2", username: "bob", created_at: "2024-02-01" },
      ]);

      const res = await request(app).get("/all?username=ali");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { id: "u1", username: "alice", created_at: "2024-01-01" },
      ]);
    });

    it("should sort users desc by created_at", async () => {
      const mockGetAllUsers = getAllUsers as jest.Mock;
      mockGetAllUsers.mockResolvedValue([
        { id: "u1", username: "alice", created_at: "2024-01-01" },
        { id: "u2", username: "bob", created_at: "2024-02-01" },
      ]);

      const res = await request(app).get("/all?order=desc");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { id: "u2", username: "bob", created_at: "2024-02-01" },
        { id: "u1", username: "alice", created_at: "2024-01-01" },
      ]);
    });

    it("should return 500 if getAllUsers fails", async () => {
      const mockGetAllUsers = getAllUsers as jest.Mock;
      mockGetAllUsers.mockRejectedValue(new Error("DB error"));

      const res = await request(app).get("/all");

      expect(res.status).toBe(500);
      expect(res.body.msg).toBe("DB error");
    });
  });

  describe("DELETE /delete-account/:id", () => {
    it("should return 403 if user is not admin", async () => {
      verifyTokenMock.mockImplementation((req, res, next) => {
        req.body.user = { id: "user1", admin: false };
        next();
      });

      const res = await request(app).delete("/delete-account/u1");

      expect(res.status).toBe(403);
      expect(res.body.msg).toBe("Access denied: Admin privileges required");
    });

    it("should delete user if admin", async () => {
      verifyTokenMock.mockImplementation((req, res, next) => {
        req.body.user = { id: "user1", admin: true };
        next();
      });

      const mockDeleteUser = deleteUser as jest.Mock;
      mockDeleteUser.mockResolvedValue(undefined);

      const res = await request(app).delete("/delete-account/u1");

      expect(mockDeleteUser).toHaveBeenCalledWith("u1");
      expect(res.status).toBe(200);
      expect(res.body.msg).toBe("User deleted successfully");
    });

    it("should return 500 if deleteUser fails", async () => {
      verifyTokenMock.mockImplementation((req, res, next) => {
        req.body.user = { id: "user1", admin: true };
        next();
      });

      const mockDeleteUser = deleteUser as jest.Mock;
      mockDeleteUser.mockRejectedValue(new Error("Delete failed"));

      const res = await request(app).delete("/delete-account/u1");

      expect(res.status).toBe(500);
      expect(res.body.msg).toBe("Delete failed");
    });
  });
});
