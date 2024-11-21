const request = require("supertest");
const express = require("express");
const saplingRouter = require("../routers/sapling"); // Adjust path if needed

const app = express();
app.use(express.json());
app.use("/", saplingRouter);

// Mock axios to simulate API responses
jest.mock("axios");
const axios = require("axios");

describe("Sapling API Routes", () => {
  // Test for /rephrase endpoint
  describe("POST /rephrase", () => {
    it("should return rephrased text (mocked)", async () => {
      // Mock axios response for rephrasing
      axios.post.mockResolvedValue({
        data: {
          results: [
            { replacement: "This is amazing!" },
            { replacement: "This is fantastic!" },
          ],
        },
      });

      const response = await request(app).post("/rephrase").send({
        text: "This is great!",
      });

      expect(response.status).toBe(200);
      expect(response.body.rephrasing.results.length).toBeGreaterThan(0);
    });

    it("should return 500 on API error", async () => {
      axios.post.mockRejectedValue(new Error("Mocked API Error"));

      const response = await request(app).post("/rephrase").send({
        text: "This is great!",
      });

      expect(response.status).toBe(500);
      expect(response.text).toContain("Error: Mocked API Error");
    });
  });

  // Test for /aidetect endpoint
  describe("POST /aidetect", () => {
    it("should return AI detection results (mocked)", async () => {
      axios.post.mockResolvedValue({
        data: {
          score: 0.95, // Overall AI detection score
          sentence_scores: [
            { sentence: "This text is generated by AI.", score: 0.99 },
          ],
        },
      });

      const response = await request(app).post("/aidetect").send({
        text: "This text is generated by AI.",
      });

      expect(response.status).toBe(200);
      expect(response.body.overallScore).toBe(0.95); // Correctly checks the mock score
      expect(response.body.sentenceScores.length).toBe(1);
    });

    it("should return 500 on API error", async () => {
      axios.post.mockRejectedValue(new Error("Mocked API Error"));

      const response = await request(app).post("/aidetect").send({
        text: "This text is generated by AI.",
      });

      expect(response.status).toBe(500);
      expect(response.text).toContain("Error: Mocked API Error");
    });
  });

  // Test for /tone endpoint
  describe("POST /tone", () => {
    it("should return sentiment analysis results (mocked)", async () => {
      axios.post.mockResolvedValue({
        data: {
          sents: ["This is great!", "I am happy."],
          overall: [[0.9, "POSITIVE"]],
          results: [
            [[0.95, "POSITIVE"]],
            [
              [0.8, "POSITIVE"],
              [0.2, "NEUTRAL"],
            ],
          ],
        },
      });

      const response = await request(app).post("/tone").send({
        text: "This is great! I am happy.",
      });

      expect(response.status).toBe(200);
      expect(response.body.sentences.length).toBe(2);
      expect(response.body.overallSentiment[0][1]).toBe("POSITIVE");
    });

    it("should return 500 on API error", async () => {
      axios.post.mockRejectedValue(new Error("Mocked API Error"));

      const response = await request(app).post("/tone").send({
        text: "This is great! I am happy.",
      });

      expect(response.status).toBe(500);
      expect(response.text).toContain("Error: Mocked API Error");
    });
  });
});
