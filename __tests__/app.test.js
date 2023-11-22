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
                expect(body.msg).toBe("topic(s) not found");
              });
          });
      });
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
            "comment_count",
          ]);
          expect(body.article.article_id).toBe(5);
          expect(body.article.comment_count).toBe("2");
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
              "comment_count",
            ]);
          });
          expect(body.articles.length).toBe(13);
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("200: should filter articles by topic when a topic is entered as a query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
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
              "comment_count",
            ]);
            expect(article.topic).toBe("mitch")
          });
          expect(body.articles.length).toBe(12);
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("200: should filter articles by topic when a topic is entered as a query", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles.length).toBe(0);
        });
    });
  });
  describe("Error handling", () => {
    test("404: should return a 404 error message if selected topic does not exist in the database", () => {
      return request(app)
        .get("/api/articles/?topic=christmas")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("topic(s) not found");
        });
    });
    test("404: should return a 404 error message if incorrect format is provided for topic", () => {
      return request(app)
        .get("/api/articles/?topic=25/12/23")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("topic(s) not found");
        });
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  describe("Functionality", () => {
    test("201: should insert new comment into the database and send back an object containing new comment", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "lurker", body: "It is good" })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 19,
            body: "It is good",
            article_id: 2,
            author: "lurker",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    test("201: should insert new comment into the database and send back an object containing new comment ignoring any additional data that is sent", () => {
      return request(app)
        .post("/api/articles/6/comments")
        .send({ username: "lurker", votes: 25, body: "It is good" })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 19,
            body: "It is good",
            article_id: 6,
            author: "lurker",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
  });
  describe("Error handling", () => {
    test("404: should return a 404 error message if selected article does not exist in the database", () => {
      return request(app)
        .post("/api/articles/999/comments")
        .send({ username: "lurker", body: "Awful" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("key not found in database");
        });
    });
    test("400: should return a 400 error message if incorrect format is provided for article id in path", () => {
      return request(app)
        .post("/api/articles/apples/comments")
        .send({ username: "lurker", body: "Awful" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("404: should return a 404 error message if the username doesn't exist", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ username: "J8723", body: "Awful" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("key not found in database");
        });
    });
    test("400: should return a 400 error message if any required data is missing", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({ body: "Awful" })
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
              "comment_count",
            ]);
          });
          expect(body.articles.length).toBe(13);
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  describe("Functionality", () => {
    test("200: should return an array containing selected comments linked to article id each including the following properties: comment_id, votes, created_at, author, body, article_id", () => {
      return request(app)
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(2);
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
          body.comments.forEach((comment) => {
            expect(Object.keys(comment)).toMatchObject([
              "comment_id",
              "body",
              "article_id",
              "author",
              "votes",
              "created_at",
            ]);
          });
        });
    });
    test("200: should return an empty array if no comments relate to the article id selected", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).toBe(0);
        });
    });
  });
  describe("Error handling", () => {
    test("404: should return a 404 error message if selected article does not exist in the database", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found with this article id");
        });
    });
    test("400: should return a 400 error message if incorrect format is provided for article id in path", () => {
      return request(app)
        .get("/api/articles/apples/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("GET /api/users", () => {
  describe("Functionality", () => {
    test("200: should return an array of objects with keys of username, name and avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(body.users.length).toBe(4);
          body.users.forEach((user) => {
            expect(Object.keys(user)).toMatchObject([
              "username",
              "name",
              "avatar_url",
            ]);
          });
        });
    });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  describe("Functionality", () => {
    test("200: should update the votes on a given article and return an updated article object", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
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
          expect(body.article.article_id).toBe(1);
          expect(body.article.votes).toBe(90);
        })
        .then(() => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 20 })
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
              expect(body.article.article_id).toBe(1);
              expect(body.article.votes).toBe(110);
            });
        });
    });
  });
  describe("Error handling", () => {
    test("404: should return a 404 error message if no selected article does not exist in the database", () => {
      return request(app)
        .patch("/api/articles/999")
        .send({ inc_votes: 20 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article not found with this article id");
        });
    });
    test("400: should return a 400 error message if incorrect format is provided for article id in path", () => {
      return request(app)
        .patch("/api/articles/apples")
        .send({ inc_votes: 20 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("400: should return a 400 error message if inc_votes is not provided in request", () => {
      return request(app)
        .patch("/api/articles/5")
        .send({ number_of_votes: 20 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
    test("400: should return a 400 error message if inc_votes is provided in an incorrect format", () => {
      return request(app)
        .patch("/api/articles/5")
        .send({ inc_votes: "twenty" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  describe("Functionality", () => {
    test("204: should delete selected comment from db and return a 204 status, a further request to the same api for the same comment should subsequently result in a 404 error 'comment not found'", () => {
      return request(app)
        .delete("/api/comments/4")
        .expect(204)
        .then(() => {
          return request(app)
            .delete("/api/comments/4")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("comment not found");
            });
        });
    });
  });
  describe("Error handling", () => {
    test("404: should return a 404 error message if selected comment does not exist in the database", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("comment not found");
        });
    });
    test("400: should return a 400 error message if incorrect format is provided for comment id in path", () => {
      return request(app)
        .delete("/api/comments/apples")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

