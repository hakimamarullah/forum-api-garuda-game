/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },

  async addComment({
    id = 'comment-123', content = 'sebuah comment', userId = 'user-123', threadId = 'thread-123', date = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO comments(id, content, owner, "threadId", date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, userId, threadId, date],
    };

    await pool.query(query);
  },

  async findCommentsById(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async softDeleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET "isDelete" = true WHERE id = $1',
      values: [commentId],
    };

    await pool.query(query);
  },
};

module.exports = CommentTableTestHelper;
