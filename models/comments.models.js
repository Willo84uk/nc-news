const db = require("../db/connection");

exports.insertNewComment = (username, body, articleId) => {
    if(!username || !body || !articleId){
        return Promise.reject({status: 400, msg: "bad request"})
    } else {
    return db.query(`INSERT INTO comments (author, article_id, body)VALUES ($1, $2, $3) 
     RETURNING *`, [username, articleId, body])
    }
}


exports.selectCommentsByArticle = (articleId, limit = 10, p=1) => {
  const validLimit = /^\d+$/.test(limit)
  const validPage = /^\d+$/.test(p)
  const offset = (p-1)*limit
  
  if(!validLimit || !validPage){
    return Promise.reject({status: 400, msg: "bad request"})
  }

  return db
    .query(
      `
    SELECT *
    FROM comments
    WHERE article_id = $1 ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      [articleId]
    )
    .then(({ rows }) => {
      return noLimitQuery = db
        .query(
          `
        SELECT *
        FROM comments
        WHERE article_id = $1 ORDER BY created_at DESC`,
          [articleId]
        ).then((result) => {
          const resultLength = result.rows.length
          if(p>Math.ceil(resultLength/limit) && p>1){
            return Promise.reject({status: 400, msg: "page out of range"})
          }
          return rows
        })
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
