const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      content: 'content',
      userId: 'user-1',
    };

    // Assert
    expect(() => new Comment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet specified data type', () => {
    const payload = {
      content: 'content',
      userId: 'user-1',
      threadId: {},
    };

    // Assert
    expect(() => new Comment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    const payload = {
      content: 'content',
      userId: 'user-1',
      threadId: 'thread-1',
    };

    const { threadId, userId, content } = new Comment(payload);

    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(userId).toEqual(payload.userId);
    expect(content).toEqual(payload.content);
  });
});
