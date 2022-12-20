const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async cleanTable() {
    await pool.query('DELETE FROM threads where 1=1');
  },
};
module.exports = ThreadsTableTestHelper;
