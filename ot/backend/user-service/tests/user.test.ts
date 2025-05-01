import { getAllUsers, deleteUser } from "../src/models/Users";
import {
  mockSelect,
  mockEq,
  mockDelete,
  mockFrom,
} from "../tests/__mocks__/@supabase/supabase-js";

describe("User model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Get All Users", () => {
    it("should return all users when no error", async () => {
      // Configuramos el mock para select
      mockSelect.mockResolvedValue({
        data: [{ id: "u1", name: "Alice" }],
        error: null,
      });

      mockFrom.mockReturnValue({ select: mockSelect });

      const result = await getAllUsers();

      expect(mockFrom).toHaveBeenCalledWith("user");
      expect(mockSelect).toHaveBeenCalledWith("*");
      expect(result).toEqual([{ id: "u1", name: "Alice" }]);
    });

    it("should throw error when select fails", async () => {
      mockSelect.mockResolvedValue({
        data: null,
        error: new Error("Select failed"),
      });

      mockFrom.mockReturnValue({ select: mockSelect });

      await expect(getAllUsers()).rejects.toThrow("Select failed");
    });
  });

  describe("Delete User", () => {
    it("should delete user by id when no error", async () => {
      mockEq.mockResolvedValue({ error: null });
      mockDelete.mockReturnValue({ eq: mockEq });

      mockFrom.mockReturnValue({ delete: mockDelete });

      await deleteUser("user1");

      expect(mockFrom).toHaveBeenCalledWith("user");
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", "user1");
    });

    it("should throw error when delete fails", async () => {
      mockEq.mockResolvedValue({ error: new Error("Delete failed") });
      mockDelete.mockReturnValue({ eq: mockEq });

      mockFrom.mockReturnValue({ delete: mockDelete });

      await expect(deleteUser("user1")).rejects.toThrow("Delete failed");
    });
  });
});
