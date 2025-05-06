import request from "supertest";
import express from "express";
import router from "../src/routes/votes";
import {
  createVote,
  getVotesBySinger,
  getVotesCountBySinger,
  getSingersByGalaId,
  getVoteByUser,
} from "../src/models/Vote";

jest.mock("../src/models/Vote");
jest.mock("../src/middleware/auth", () => ({
  verifyToken: jest.fn((req, res, next) => {
    req.body.user = { id: "user1" };
    next();
  }),
}));

describe("Vote routes", () => {
  const app = express();
  app.use(express.json());
  app.use(router);

  // ruta POST /vote (votar)
  describe("POST /vote", () => {
    it("should return 201 if vote is successfully created", async () => {
      const mockCreateVote = createVote as jest.Mock;
      mockCreateVote.mockResolvedValue({ id: "vote1" });

      const res = await request(app)
        .post("/vote")
        .send({ singerId: "s1", galaId: "g1", user: { id: "user1" } });

      expect(res.status).toBe(201);
      expect(res.body.msg).toBe("Voted successfully");
      expect(res.body.vote.id).toBe("vote1");
    });

    it("should return 500 if vote creation fails", async () => {
      const mockCreateVote = createVote as jest.Mock;
      mockCreateVote.mockRejectedValue(new Error("Vote creation failed"));

      const res = await request(app)
        .post("/vote")
        .send({ singerId: "s1", galaId: "g1", user: { id: "user1" } });

      expect(res.status).toBe(500);
      expect(res.body.msg).toBe("Vote creation failed");
    });
  });

  // ruta GET /votes/:singerId (obtener votos por cantante)
  describe("GET /votes/:singerId", () => {
    it("should return 200 and votes for the singer", async () => {
      const mockGetVotesBySinger = getVotesBySinger as jest.Mock;
      mockGetVotesBySinger.mockResolvedValue([{ id: "v1" }]);

      const res = await request(app).get("/votes/singer1");

      expect(res.status).toBe(200);
      expect(res.body.singerId).toBe("singer1");
      expect(res.body.votes).toEqual([{ id: "v1" }]);
    });

    it("should return 500 if an error occurs", async () => {
      const mockGetVotesBySinger = getVotesBySinger as jest.Mock;
      mockGetVotesBySinger.mockRejectedValue(
        new Error("Error retrieving votes")
      );

      const res = await request(app).get("/votes/singer1");

      expect(res.status).toBe(500);
      expect(res.body.msg).toBe("Error retrieving votes");
    });
  });

  // ruta GET /votes-by-gala/:galaId (obtener votos totales por gala)
  describe("GET /votes-by-gala/:galaId", () => {
    it("should return 200 and vote counts for singers in the gala", async () => {
      const mockGetSingersByGalaId = getSingersByGalaId as jest.Mock;
      mockGetSingersByGalaId.mockResolvedValue([{ id: "s1" }]);

      const mockGetVotesCountBySinger = getVotesCountBySinger as jest.Mock;
      mockGetVotesCountBySinger.mockResolvedValue([
        { id: "s1", totalVotes: 10 },
      ]);

      const res = await request(app).get("/votes-by-gala/gala1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ id: "s1", totalVotes: 10 }]);
    });

    it("should return 500 if an error occurs", async () => {
      const mockGetSingersByGalaId = getSingersByGalaId as jest.Mock;
      mockGetSingersByGalaId.mockRejectedValue(
        new Error("Error retrieving singers")
      );

      const res = await request(app).get("/votes-by-gala/gala1");

      expect(res.status).toBe(500);
      expect(res.body.msg).toBe("Error retrieving singers");
    });
  });

  // ruta GET /vote/:galaId (obtener el voto por usuario)
  describe("GET /vote/:galaId", () => {
    it("should return 200 and the vote by user for the given gala", async () => {
      const mockGetVoteByUser = getVoteByUser as jest.Mock;
      mockGetVoteByUser.mockResolvedValue({ id: "v1" });

      const res = await request(app)
        .get("/vote/gala1")
        .set("Authorization", "Bearer valid-token"); // Asegúrate de agregar el token en la cabecera

      expect(res.status).toBe(200);
      expect(res.body.id).toBe("v1");
    });

    it("should return 404 if vote is not found", async () => {
      const mockGetVoteByUser = getVoteByUser as jest.Mock;
      mockGetVoteByUser.mockResolvedValue(null);

      const res = await request(app)
        .get("/vote/gala1")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(404);
      expect(res.body.msg).toBe("Vote not found");
    });

    it("should return 500 if an error occurs", async () => {
      const mockGetVoteByUser = getVoteByUser as jest.Mock;
      mockGetVoteByUser.mockRejectedValue(new Error("Error retrieving vote"));

      const res = await request(app)
        .get("/vote/gala1")
        .set("Authorization", "Bearer valid-token");

      expect(res.status).toBe(500);
      expect(res.body.msg).toBe("Error retrieving vote");
    });
  });
});
