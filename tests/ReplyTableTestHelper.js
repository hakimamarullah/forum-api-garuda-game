const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM reply WHERE 1=1');
  },

  async addReply({
    id = 'reply-123', content = 'sebuah balasan', userId = 'user-123', threadId = 'thread-123', commentId = 'comment-123',
  }) {
    const query = {
      text: 'INSERT INTO reply(id, content, owner, "threadId", "parentId") VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, userId, threadId, commentId],
    };

    await pool.query(query);
  },
};

module.exports = ReplyTableTestHelper;
