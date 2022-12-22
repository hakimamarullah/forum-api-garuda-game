const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'sebuah title',
        body: 'body',
        userId: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'sebuah title',
        body: 'body',
        userId: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'sebuah title',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadDetails', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(threadRepositoryPostgres.getThreadDetails('thread-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread details when thread is found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const date = new Date();
      await ThreadTableTestHelper.addThread({ date });

      // Action & Assert
      const threadDetails = await threadRepositoryPostgres.getThreadDetails('thread-123');
      expect(threadDetails.id).toBe('thread-123');
      expect(threadDetails.title).toEqual('sebuah title');
      expect(threadDetails.body).toEqual('sebuah body');
      expect(threadDetails.date).toEqual(date);
      expect(threadDetails.comments).toHaveLength(0);
      expect(threadDetails.username).toEqual('dicoding');
      expect(threadDetails.comments).toBeInstanceOf(Array);
    });

    it('should return thread details when thread is found with 1 comment in it', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const date = new Date();
      await ThreadTableTestHelper.addThread({ date });
      await CommentTableTestHelper.addComment({ date });
      await ReplyTableTestHelper.addReply({ date });

      // Action & Assert
      const threadDetails = await threadRepositoryPostgres.getThreadDetails('thread-123');
      expect(threadDetails.id).toBe('thread-123');
      expect(threadDetails.title).toEqual('sebuah title');
      expect(threadDetails.body).toEqual('sebuah body');
      expect(threadDetails.date).toEqual(date);
      expect(threadDetails.comments).toHaveLength(1);
      expect(threadDetails.username).toEqual('dicoding');
      expect(threadDetails.comments).toBeInstanceOf(Array);
      expect(threadDetails.comments[0].id).toEqual('comment-123');
      expect(threadDetails.comments[0].username).toEqual('dicoding');
      expect(threadDetails.comments[0].date).toEqual(date);
      expect(threadDetails.comments[0].content).toEqual('sebuah comment');

      expect(threadDetails.comments[0].replies).toBeDefined();
      expect(threadDetails.comments[0].replies).toBeInstanceOf(Array);
      expect(threadDetails.comments[0].replies).toHaveLength(1);

      expect(threadDetails.comments[0].replies[0].id).toEqual('reply-123');
      expect(threadDetails.comments[0].replies[0].username).toEqual('dicoding');
      expect(threadDetails.comments[0].replies[0].date).toEqual(date);
      expect(threadDetails.comments[0].replies[0].content).toEqual('sebuah balasan');
    });

    it('should return thread details when thread is found with 1 deleted comment and reply in it', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const date = new Date();
      await ThreadTableTestHelper.addThread({ date });
      await CommentTableTestHelper.addComment({ date });
      await ReplyTableTestHelper.addReply({ date });
      await ReplyTableTestHelper.softDeleteReplyById('reply-123');
      await CommentTableTestHelper.softDeleteCommentById('comment-123');

      // Action & Assert
      const threadDetails = await threadRepositoryPostgres.getThreadDetails('thread-123');
      expect(threadDetails.id).toBe('thread-123');
      expect(threadDetails.title).toEqual('sebuah title');
      expect(threadDetails.body).toEqual('sebuah body');
      expect(threadDetails.date).toEqual(date);
      expect(threadDetails.comments).toHaveLength(1);
      expect(threadDetails.username).toEqual('dicoding');
      expect(threadDetails.comments).toBeInstanceOf(Array);
      expect(threadDetails.comments[0].id).toEqual('comment-123');
      expect(threadDetails.comments[0].username).toEqual('dicoding');
      expect(threadDetails.comments[0].date).toEqual(date);
      expect(threadDetails.comments[0].content).toEqual('**komentar telah dihapus**');

      expect(threadDetails.comments[0].replies).toBeDefined();
      expect(threadDetails.comments[0].replies).toBeInstanceOf(Array);
      expect(threadDetails.comments[0].replies).toHaveLength(1);

      expect(threadDetails.comments[0].replies[0].id).toEqual('reply-123');
      expect(threadDetails.comments[0].replies[0].username).toEqual('dicoding');
      expect(threadDetails.comments[0].replies[0].date).toEqual(date);
      expect(threadDetails.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
    });

    it('should return thread details when thread is found with comments ordered by date', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const date = new Date();
      const date2 = new Date();
      await ThreadTableTestHelper.addThread({ date });
      await CommentTableTestHelper.addComment({ date });
      await CommentTableTestHelper.addComment({ id: 'comment-111', date: date2 });

      // Action & Assert
      const threadDetails = await threadRepositoryPostgres.getThreadDetails('thread-123');
      expect(threadDetails.id).toBe('thread-123');
      expect(threadDetails.title).toEqual('sebuah title');
      expect(threadDetails.body).toEqual('sebuah body');
      expect(threadDetails.date).toEqual(date);
      expect(threadDetails.username).toEqual('dicoding');
      expect(threadDetails.comments).toBeInstanceOf(Array);
      expect(threadDetails.comments).toHaveLength(2);
      expect(threadDetails.comments[0].id).toEqual('comment-123');
      expect(threadDetails.comments[0].username).toEqual('dicoding');
      expect(threadDetails.comments[0].date).toEqual(date);
      expect(threadDetails.comments[0].content).toEqual('sebuah comment');

      expect(threadDetails.comments[1].id).toEqual('comment-111');
      expect(threadDetails.comments[1].username).toEqual('dicoding');
      expect(threadDetails.comments[1].date).toEqual(date2);
      expect(threadDetails.comments[1].content).toEqual('sebuah comment');
    });
  });

  describe('verifyThreadExists function', () => {
    it('should throw NotFoundError when thread doesn\'t exist with the given thread id', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.cleanTable();
      await ThreadTableTestHelper.addThread({ id: 'thread-test', date: new Date() });

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-test1'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw any error when thread exists', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      await ThreadTableTestHelper.addThread({ id: 'thread-test', date: new Date() });

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-test'))
        .resolves
        .not
        .toThrow();
    });
  });
});
