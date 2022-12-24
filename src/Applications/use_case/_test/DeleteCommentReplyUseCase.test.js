const ReplyRepository = require('../../../Domains/reply/ReplyRepository');
const DeleteCommentReplyUseCase = require('../DeleteCommentReplyUseCase');

describe('DeleteCommentReplyUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({});

    // Action & Assert
    await expect(deleteCommentReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_ATTRIBUTE');
  });

  it('should throw error if payload data type doesnt meet type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: true,
      userId: 'user-1',
      replyId: 'reply-1',
    };
    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({});

    // Action & Assert
    await expect(deleteCommentReplyUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete comment reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-1',
      userId: 'user-1',
      replyId: 'reply-1',
    };

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.verifyCommentExists = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockReplyRepository.softDeleteCommentReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Act
    await deleteCommentReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.verifyCommentExists)
      .toHaveBeenCalledWith(useCasePayload);
    expect(mockReplyRepository.softDeleteCommentReply)
      .toHaveBeenCalledWith(useCasePayload);
    expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(useCasePayload.replyId, useCasePayload.userId);
  });
});
