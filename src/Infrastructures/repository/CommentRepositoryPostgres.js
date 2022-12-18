const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const InvariantError = require('../../Commons/exceptions/InvariantError');
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

    return this._pool.query(query)
      .then((res) => res.rows[0])
      .catch((err) => {
        if (err.code === '23503') {
          throw new NotFoundError('Thread tidak ditemukan');
        }
      });
  }

  async softDeleteComment(threadId, commentId, ownerId) {
    const query = {
      text: 'UPDATE comments SET "isDelete" = true, content = $4 WHERE "threadId" = $1 AND id = $2 AND owner = $3',
      values: [threadId, commentId, ownerId, '**komentar telah dihapus**'],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new AuthorizationError('Anda tidak diizinkan menghapus comment ini');
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
