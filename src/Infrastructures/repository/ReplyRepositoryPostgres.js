const ReplyRepository = require('../../Domains/reply/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

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

    const { rows } = await this._pool.query(query);

    return rows[0];
  }

  async softDeleteCommentReply(deleteReply) {
    const {
      threadId, replyId, userId, commentId,
    } = deleteReply;

    const query = {
      text: 'UPDATE reply SET "isDelete" = true WHERE "threadId" = $1 AND id = $2 AND owner = $3 AND "parentId" = $4',
      values: [threadId, replyId, userId, commentId],
    };

    await this._pool.query(query);
  }

  async verifyCommentExists(payload) {
    const { threadId, commentId, replyId } = payload;
    const query = {
      text: 'SELECT id FROM reply WHERE id = $1 AND "threadId" = $2 AND "parentId" = $3',
      values: [replyId, threadId, commentId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Data reply tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, userId) {
    const query = {
      text: 'SELECT owner FROM reply WHERE id = $1',
      values: [replyId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }

    const trueOwner = rows[0].owner;

    if (trueOwner !== userId) {
      throw new AuthorizationError('Anda tidak berhak menghapus balasan ini');
    }
  }
}

module.exports = ReplyRepositoryPostgres;
