const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM reply WHERE 1=1');
  },

  async addReply({
    id = 'reply-123', content = 'sebuah balasan', userId = 'user-123', threadId = 'thread-123', commentId = 'comment-123', date = new Date(),
  }) {
    const query = {
      text: 'INSERT INTO reply(id, content, owner, "threadId", "parentId", date) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, userId, threadId, commentId, date],
    };

    await pool.query(query);
  },

  async findRepliesById(replyId) {
    const query = {
      text: 'SELECT * FROM reply WHERE id = $1',
      values: [replyId],
    };

    const { rows } = await pool.query(query);

    return rows;
  },

  async softDeleteReplyById(replyId) {
    const query = {
      text: 'UPDATE reply SET "isDelete" = true WHERE id = $1',
      values: [replyId],
    };

    await pool.query(query);
  },
};

module.exports = ReplyTableTestHelper;
