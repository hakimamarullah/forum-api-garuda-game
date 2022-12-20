const pool = require('../src/Infrastructures/database/postgres/pool');

const ReplyTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM reply WHERE 1=1');
  },
};

module.exports = ReplyTableTestHelper;
