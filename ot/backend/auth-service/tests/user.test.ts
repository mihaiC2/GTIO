import * as authService from "../src/models/Auth";
import {
  mockInsert,
  mockSelect,
  mockSingle,
  mockEq,
  mockUpdate,
} from "../tests/__mocks__/@supabase/supabase-js";

describe("User model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Db User", () => {
    it("should insert user data successfully", async () => {
      mockInsert.mockResolvedValue({ error: null });

      await expect(
        authService.createDbUser({ id: "u1", email: "test@example.com" })
      ).resolves.toBeUndefined();

      expect(mockInsert).toHaveBeenCalledWith({
        id: "u1",
        email: "test@example.com",
      });
    });

    it("should throw error if insert fails", async () => {
      mockInsert.mockResolvedValue({ error: { message: "Insert failed" } });

      await expect(authService.createDbUser({ id: "u1" })).rejects.toEqual({
        message: "Insert failed",
      });
    });
  });

  describe("Get User By Auth Id", () => {
    it("should return user data if found", async () => {
      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ single: mockSingle });
      mockSingle.mockResolvedValue({ data: { id: "u1" }, error: null });

      const result = await authService.getUserByAuthId("u1");

      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(mockEq).toHaveBeenCalledWith("id", "u1");
      expect(result).toEqual({ id: "u1" });
    });

    it("should return null if user not found", async () => {
      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ single: mockSingle });
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "User not found" },
      });

      const result = await authService.getUserByAuthId("u1");

      expect(result).toBeNull();
    });

    it("should throw error if other error", async () => {
      mockSelect.mockReturnValue({ eq: mockEq });
      mockEq.mockReturnValue({ single: mockSingle });
      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Other error" },
      });

      await expect(authService.getUserByAuthId("u1")).rejects.toEqual({
        message: "Other error",
      });
    });
  });

  describe("Update User By Id", () => {
    it("should update user data successfully", async () => {
      mockUpdate.mockReturnValue({ eq: mockEq });
      mockEq.mockResolvedValue({ error: null });

      await expect(
        authService.updateUserById("u1", { username: "alice" })
      ).resolves.toBeUndefined();

      expect(mockUpdate).toHaveBeenCalledWith({ username: "alice" });
      expect(mockEq).toHaveBeenCalledWith("id", "u1");
    });

    it("should throw error if update fails", async () => {
      mockUpdate.mockReturnValue({ eq: mockEq });
      mockEq.mockResolvedValue({ error: { message: "Update failed" } });

      await expect(
        authService.updateUserById("u1", { username: "bob" })
      ).rejects.toEqual({
        message: "Update failed",
      });
    });
  });
});
