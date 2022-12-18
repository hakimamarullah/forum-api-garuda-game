const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, userId } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, userId],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadDetails(threadId) {
    const query = {
      text: `
      SELECT t.id as tid, t.title, t.body, t.date as tdate, us.username, cm.*, rp.*
      FROM threads t
      LEFT JOIN  (SELECT c.id, u.username as cname, c.date, c.content, c."threadId"
                  FROM comments c, users u
                  WHERE c."owner" = u.id
                  ORDER BY c.date ASC) cm ON t.id = cm."threadId"
      LEFT JOIN (SELECT r.id as rid, ur.username as rname, r.date as rdate, r.content as rcontent,  r."parentId"
                 FROM reply r, users ur
                 WHERE r.owner = ur.id
                 ORDER BY r.date ASC) rp ON rp."parentId" = cm.id
      LEFT JOIN users us
      ON us.id = t.owner
      WHERE t.id = $1
      `,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length === 0) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    const {
      tid: id, title, body, tdate: date, username,
    } = rows[0];

    const replies = rows.reduce((group, item) => {
      const {
        id: commentId, rid, rname, rdate, rcontent,
      } = item;
      group[commentId] = group[commentId] ?? [];
      group[commentId].push({
        id: rid, username: rname, date: rdate, content: rcontent,
      });
      return group;
    }, {});

    let comments = rows.map((item) => ({
      id: item.id,
      username: item.cname,
      date: item.date,
      content: item.content,
      replies: replies[item.id],
    }));

    comments = comments.filter((value, index, self) => index === self.findIndex((t) => (
      t.id === value.id
    )));

    return {
      id, title, body, date, username, comments,
    };
  }
}

module.exports = ThreadRepositoryPostgres;
