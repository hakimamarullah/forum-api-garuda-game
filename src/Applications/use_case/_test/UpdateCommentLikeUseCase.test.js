const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UpdateCommentLikeUseCase = require('../UpdateCommentLikeUseCase');

describe('UpdateCommentLikeUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   * threadId, commentId, userId
   */
  it('should orchestrating the update like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-1',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockThreadRepository.verifyThreadExists = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.updateCommentLike = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));

    /** creating use case instance */
    const updateCommentLikeUseCase = new UpdateCommentLikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const updatedCommentLike = await updateCommentLikeUseCase
      .execute(useCasePayload);

    expect(updatedCommentLike).toEqual(true);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentExists)
      .toBeCalledWith(useCasePayload.threadId, useCasePayload.commentId);
    expect(mockCommentRepository.updateCommentLike)
      .toBeCalledWith(useCasePayload.userId, useCasePayload.commentId, useCasePayload.threadId);
  });

  it('should throw error when new comment like payload not contains needed property', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      userId: 'user-1',
      threadId: '',
    };

    const useCasePayload2 = {
      commentId: 'comment-123',
      userId: {},
      threadId: 'thread-1',
    };

    /** creating use case instance */
    const updateCommentLikeUseCase = new UpdateCommentLikeUseCase({});

    // Action & Assert
    await expect(updateCommentLikeUseCase.execute(useCasePayload)).rejects.toThrowError('UPDATE_COMMENT_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_ATTRIBUTE');
    await expect(updateCommentLikeUseCase.execute(useCasePayload2)).rejects.toThrowError('UPDATE_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
