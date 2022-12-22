const ReplyRepository = require('../../Domains/reply/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addCommentReply(reply) {
    const {
      threadId, commentId, userId, content,
    } = reply;

    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO reply(id, content, owner, "threadId", "parentId") VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, userId, threadId, commentId],
    };

    return this._pool.query(query)
      .then((res) => res.rows[0])
      .catch((err) => {
        if (err.code === '23503') {
          throw new NotFoundError('Thread atau comment tidak ditemukan');
        }

        throw new InvariantError(err.message);
      });
  }

  async softDeleteCommentReply(deleteReply) {
    const {
      threadId, replyId, userId, commentId,
    } = deleteReply;

    const query = {
      text: 'UPDATE reply SET "isDelete" = true, content = $5 WHERE "threadId" = $1 AND id = $2 AND owner = $3 AND "parentId" = $4',
      values: [threadId, replyId, userId, commentId, '**balasan telah dihapus**'],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new AuthorizationError('Anda tidak diizinkan menghapus balasan ini');
    }
  }

  async verifyCommentExists(payload) {
    const { threadId, commentId, replyId } = payload;
    const query = {
      text: 'SELECT id FROM reply WHERE id = $1 AND "threadId" = $2 AND "parentId" = $3',
      values: [replyId, threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Data reply tidak ditemukan');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
