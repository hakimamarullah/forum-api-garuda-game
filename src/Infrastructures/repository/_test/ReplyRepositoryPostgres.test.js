const { DatabaseError } = require('pg');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('ReplyRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  beforeEach(async () => {
    await ThreadTableTestHelper.addThread({ date: new Date() });
    await CommentTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ReplyTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addCommentReply function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newReply = {
        content: 'sebuah balasan',
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addCommentReply(newReply);

      // Assert
      const replies = await ReplyTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should throw error when database constraints error', async () => {
      // Arrange
      const newReply = {
        content: 'sebuah balasan',
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      await replyRepositoryPostgres.addCommentReply(newReply);

      // Action
      await expect(replyRepositoryPostgres.addCommentReply(newReply))
        .rejects
        .toThrowError(DatabaseError);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newReply = {
        content: 'sebuah balasan',
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addCommentReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual({
        id: 'reply-123',
        content: 'sebuah balasan',
        owner: 'user-123',
      });
    });
  });

  describe('verifyCommentExistFunction', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const payload = {
        threadId: 'thread-123',
        commentId: 'comment-11',
        userId: 'user-123',
      };

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyCommentExists(payload))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw error when comment and thread is found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const payload = {
        threadId: 'thread-1',
        commentId: 'comment-1',
        replyId: 'reply-test',
      };
      await ThreadTableTestHelper.addThread({ id: 'thread-1', date: new Date() });
      await CommentTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', userId: 'user-123' });
      await ReplyTableTestHelper.addReply({
        id: 'reply-test', threadId: 'thread-1', commentId: 'comment-1', userId: 'user-123',
      });

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyCommentExists(payload)).resolves.not.toThrow();
    });
  });

  describe('softDeleteCommentReply function', () => {
    it('should delete comment successfully', async () => {
      // Arrange
      const payload = {
        threadId: 'thread-1',
        commentId: 'comment-1',
        replyId: 'reply-test',
        userId: 'user-123',
      };
      await ThreadTableTestHelper.addThread({ id: 'thread-1', date: new Date() });
      await CommentTableTestHelper.addComment({ id: 'comment-1', threadId: 'thread-1', userId: 'user-123' });
      await ReplyTableTestHelper.addReply({
        id: 'reply-test', threadId: 'thread-1', commentId: 'comment-1', userId: 'user-123',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.softDeleteCommentReply(payload))
        .resolves
        .not
        .toThrow(NotFoundError);

      const replies = await ReplyTableTestHelper.findRepliesById('reply-test');
      expect(replies).toHaveLength(1);
      expect(replies[0].content).toEqual('sebuah balasan');
      expect(replies[0].isDelete).toEqual(true);
    });
  });
});
