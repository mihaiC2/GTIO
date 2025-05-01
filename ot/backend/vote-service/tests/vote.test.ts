import * as voteService from "../src/models/Vote";
import {
  mockInsert,
  mockSelect,
  mockSingle,
  mockEq,
  mockIn,
  mockGte,
} from "../tests/__mocks__/@supabase/supabase-js";

describe("voteService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createVote", () => {
    it("should insert vote and return data", async () => {
      mockSingle.mockResolvedValue({ data: { id: "vote1" }, error: null });

      const result = await voteService.createVote({
        singer_id: "s1",
        gala_id: "g1",
      });

      expect(mockInsert).toHaveBeenCalledWith({
        singer_id: "s1",
        gala_id: "g1",
      });
      expect(result).toEqual({ id: "vote1" });
    });

    it("should throw error if insert fails", async () => {
      mockInsert.mockImplementation(() => ({
        select: mockSelect,
      }));

      mockSelect.mockImplementation(() => ({
        single: mockSingle,
      }));

      mockSingle.mockResolvedValue({
        data: null,
        error: { message: "Insert failed" },
      });

      await expect(voteService.createVote({ singer_id: "s1" })).rejects.toEqual(
        { message: "Insert failed" }
      );
    });
  });

  describe("getVotesBySinger", () => {
    it("should return votes for singer", async () => {
      mockSelect.mockImplementation(() => ({
        eq: mockEq,
      }));

      mockEq.mockResolvedValue({ data: [{ id: "v1" }], error: null });

      const result = await voteService.getVotesBySinger("singer1");

      expect(mockEq).toHaveBeenCalledWith("singer_id", "singer1");
      expect(result).toEqual([{ id: "v1" }]);
    });
  });

  describe("getSingerVoteStatsForGala", () => {
    it("should return vote stats grouped by singer", async () => {
      mockSelect.mockImplementation(() => ({
        eq: mockEq,
      }));
      mockEq.mockResolvedValue({
        data: [
          { singer_id: "s1", singer: [{ first_name: "Alice" }] },
          { singer_id: "s1", singer: [{ first_name: "Alice" }] },
          { singer_id: "s2", singer: [{ first_name: "Bob" }] },
        ],
        error: null,
      });

      const result = await voteService.getSingerVoteStatsForGala("gala1");

      expect(result).toEqual({
        s1: { singerId: "s1", singerName: "Alice", totalVotes: 2 },
        s2: { singerId: "s2", singerName: "Bob", totalVotes: 1 },
      });
    });
  });

  describe("getVotesCountBySinger", () => {
    it("should return vote count for all singers", async () => {
      const singers = [
        {
          id: "s1",
          first_name: "A",
          last_name: "B",
          stage_name: "C",
          photo_url: "",
          bio: "",
          birth_date: "",
        },
        {
          id: "s2",
          first_name: "X",
          last_name: "Y",
          stage_name: "Z",
          photo_url: "",
          bio: "",
          birth_date: "",
        },
      ];

      mockSelect.mockImplementation(() => ({
        in: mockIn,
      }));

      mockIn.mockImplementation(() => ({
        eq: mockEq,
      }));

      mockEq.mockResolvedValue({
        data: [
          { singer_id: "s1", user_id: "u1" },
          { singer_id: "s1", user_id: "u2" },
          { singer_id: "s2", user_id: "u3" },
        ],
        error: null,
      });

      const result = await voteService.getVotesCountBySinger(singers, "gala1");

      expect(result).toEqual([
        { ...singers[0], totalVotes: 2 },
        { ...singers[1], totalVotes: 1 },
      ]);
    });
  });

  describe("getVoteByUser", () => {
    it("should return vote by user and gala", async () => {
      mockSelect.mockReturnValue({ eq: mockEq });

      mockEq.mockReturnValue({ eq: mockEq, single: mockSingle });

      mockSingle.mockResolvedValue({ data: { id: "v1" }, error: null });

      const result = await voteService.getVoteByUser("user1", "gala1");

      expect(result).toEqual({ id: "v1" });
    });
  });

  describe("getSingersByGalaId", () => {
    it("should return singers for gala", async () => {
      mockSelect.mockReturnValue({
        gte: mockGte,
      });

      mockGte.mockResolvedValue({ data: [{ id: "s1" }], error: null });

      const result = await voteService.getSingersByGalaId("gala1");

      expect(result).toEqual([{ id: "s1" }]);
    });
  });
});
