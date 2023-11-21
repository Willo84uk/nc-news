const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

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

describe("GET /api", () => {
  test("200: responds with an object describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
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

describe("GET /api/articles/:article_id", () => {
  describe("Functionality", () => {
    test("200: should return an object containing selected article including the following properties: author, title, article_id, body, topic, created_at, votes, art_img_url ", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then(({ body }) => {
          expect(Object.keys(body.article)).toMatchObject([
            "article_id",
            "title",
            "topic",
            "author",
            "body",
            "created_at",
            "votes",
            "article_img_url",
          ]);
          expect(body.article.article_id).toBe(5);
        });
    });
  });
  describe("Error handling", () => {
    test("404: should return a 404 error message if no selected article does not exist in the database", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found with this article id");
        });
    });
    test("400: should return a 400 error message if incorrect format is provided for article id in path", () => {
        return request(app)
          .get("/api/articles/apples")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("bad request");
          });
      });
  });
});

describe("GET /api/articles", () => {
    describe("Functionality", () => {
      test("200: should return an object containing all articles including the following properties: author, title, article_id, topic, created_at, votes, art_img_url, comment_count, automatically sorted in reverse date order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach((article) => {
              expect(Object.keys(article)).toMatchObject([
                "article_id",
                "title",
                "topic",
                "author",
                "created_at",
                "votes",
                "article_img_url",
                "comment_count"
              ]);
            })
            expect(body.articles.length).toBe(13);
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
          });
      });
    });
  });


