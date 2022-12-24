const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const id = `comment-${this._idGenerator()}`;
    const { content, userId, threadId } = comment;

    const query = {
      text: 'INSERT INTO comments(id, content, owner, "threadId") VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, userId, threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows[0];
  }

  async softDeleteComment(threadId, commentId, ownerId) {
    const query = {
      text: 'UPDATE comments SET "isDelete" = true WHERE "threadId" = $1 AND id = $2 AND owner = $3',
      values: [threadId, commentId, ownerId],
    };

    await this._pool.query(query);
  }

  async verifyCommentOwner(commentId, ownerId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new NotFoundError('Komen tidak ditemukan');
    }

    const trueOwner = rows[0].owner;

    if (trueOwner !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak menghapus komen ini');
    }
  }

  async verifyCommentExists(threadId, commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND "threadId" = $2',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('Thread atau comment tidak ditemukan');
    }
  }
}

module.exports = CommentRepositoryPostgres;
