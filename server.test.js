const request = require("supertest");
const app = require("./server"); // Import your Express app

describe("Express Server", () => {
  // Test the root route
  describe("GET /", () => {
    it("responds with status 200", async () => {
      const response = await request(app).get("/");
      expect(response.status).toBe(200);
    });
  });

  // Add more test cases for your routes, middleware, and other functionality here
});
