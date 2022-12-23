const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const AddCommentReplyUseCase = require('../AddCommentReplyUseCase');

describe('AddCommentReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   * threadId, commentId, userId, content,
   */
  it('should orchestrating the add comment reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-1',
      content: 'ini balasan',
    };

    const expectedAddedCommentReply = {
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.userId,
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockReplyRepository.addCommentReply = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'reply-123',
        content: useCasePayload.content,
        owner: useCasePayload.userId,
      }));

    mockCommentRepository.verifyCommentExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getCommentReplyUseCase = new AddCommentReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedCommentReply = await getCommentReplyUseCase
      .execute(useCasePayload);

    expect(addedCommentReply).toStrictEqual(expectedAddedCommentReply);
    expect(mockReplyRepository.addCommentReply).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.verifyCommentExists)
      .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
  });

  it('should throw error when new reply payload not contains needed property', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      userId: 'user-1',
      content: 'ini balasan2',
      threadId: '',
    };

    const useCasePayload2 = {
      commentId: 'comment-123',
      userId: {},
      content: 'ini balasan2',
      threadId: 'thread-1',
    };

    /** creating use case instance */
    const commentReplyUseCase = new AddCommentReplyUseCase({});

    // Action & Assert
    await expect(commentReplyUseCase.execute(useCasePayload)).rejects.toThrowError('ADD_COMMENT_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_ATTRIBUTE');
    await expect(commentReplyUseCase.execute(useCasePayload2)).rejects.toThrowError('ADD_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
