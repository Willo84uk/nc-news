const db = require("../db/connection");

exports.selectCommentsByArticle = (articleId) => {
  return db
    .query(
      `
    SELECT *
    FROM comments
    WHERE article_id = $1 ORDER BY created_at DESC`,
      [articleId]
    )
    .then(({ rows }) => {
      return { rows };
    });
};

exports.deleteCommentFromDb = (commentId) => {
  return db
    .query(
      `
    DELETE FROM comments WHERE comment_id = $1 RETURNING *`,
      [commentId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};
