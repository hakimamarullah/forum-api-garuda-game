const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const Comment = require('../../../Domains/comments/entities/Comment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('CommentRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  beforeEach(async () => {
    await ThreadTableTestHelper.addThread({ date: new Date() });
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new Comment({
        content: 'sebuah comment',
        userId: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new Comment({
        content: 'sebuah comment',
        userId: 'user-123',
        threadId: 'thread-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual({
        id: 'comment-123',
        content: 'sebuah comment',
        owner: 'user-123',
      });
    });
  });

  describe('verifyCommentExistFunction', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('thread-12', 'comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw error when comment and thread is found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({ id: 'thread-12', date: new Date() });
      await CommentTableTestHelper.addComment({ id: 'comment-12', threadId: 'thread-12' });

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('thread-12', 'comment-12')).resolves.not.toThrow();
    });
  });

  describe('softDeleteComment function', () => {
    it('should delete comment successfully', async () => {
      // Arrange
      await ThreadTableTestHelper.addThread({ id: 'thread-1', date: new Date() });
      await CommentTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', userId: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Actions
      await commentRepositoryPostgres.softDeleteComment('thread-1', 'comment-1', 'user-123');
      const comments = await CommentTableTestHelper.findCommentsById('comment-1');

      expect(comments).toHaveLength(1);
      expect(comments[0].isDelete).toEqual(true);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw not found error when comment is not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({ id: 'thread-12', date: new Date() });
      await CommentTableTestHelper.addComment({ id: 'comment-12', threadId: 'thread-12' });

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-1', 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw authorization error when given user is not the owner of comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({ id: 'thread-12', date: new Date() });
      await CommentTableTestHelper.addComment({ id: 'comment-12', threadId: 'thread-12' });

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-12', 'user-12'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should throw no error when the given user id is the owner of the given comment id', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({ id: 'thread-12', date: new Date() });
      await CommentTableTestHelper.addComment({ id: 'comment-12', threadId: 'thread-12' });

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-12', 'user-123'))
        .resolves
        .not
        .toThrow();
    });
  });
});
