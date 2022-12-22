/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },

  async addComment({
    id = 'comment-123', content = 'sebuah comment', userId = 'user-123', threadId = 'thread-123',
  }) {
    const query = {
      text: 'INSERT INTO comments(id, content, owner, "threadId") VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, userId, threadId],
    };

    await pool.query(query);
  },
};

module.exports = CommentTableTestHelper;
