const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');

describe('DeleteThreadCommentUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({});

    // Action & Assert
    await expect(deleteThreadCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_THREAD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_ATTRIBUTE');
  });

  it('should throw error if payload data type doesnt meet type specification', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: true,
      ownerId: 'user-1',
    };
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({});

    // Action & Assert
    await expect(deleteThreadCommentUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('DELETE_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete comment  action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-1',
      ownerId: 'user-1',
    };

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.softDeleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Act
    await deleteThreadCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyCommentExists)
      .toHaveBeenCalledWith(useCasePayload.threadId, useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.commentId, useCasePayload.ownerId);
    expect(mockCommentRepository.softDeleteComment)
      .toHaveBeenCalledWith(
        useCasePayload.threadId,

        useCasePayload.commentId,

        useCasePayload.ownerId,
      );
    expect(mockCommentRepository.deleteCommentLike)
      .toHaveBeenCalledWith(
        useCasePayload.threadId,

        useCasePayload.commentId,
      );
  });
});
