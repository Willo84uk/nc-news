const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /not-a-path", () => {
  test("404: responds with a 404 if path not found with a user message to confirm reason for error", () => {
    return request(app)
      .get("/not-a-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("GET /api/topics", () => {
  describe("Functionality", () => {
    test("200: should return an array of objects with keys of slug and description", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
          expect(body.topics.length).toBe(3);
          body.topics.forEach((topic) => {
            expect(Object.keys(topic)).toMatchObject(["slug", "description"]);
          });
        });
    });
  });
  describe("Error handling", () => {
    test("404: should return a 404 error message if no topics exist in the database", () => {
      return db.query(`DELETE FROM comments *;`).then(() => {
        return db
          .query(`DELETE FROM articles *;`)
          .then(() => {
            return db.query(`DELETE FROM topics *;`);
          })
          .then(() => {
            return request(app)
              .get("/api/topics")
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe("no topics exist");
              });
          });
      });
    });
  });
});
