const CommentRepository = require('../CommentRepository');

describe('Comment repository interface', () => {
  it('should throw error when method is not implemented', async () => {
    const commentRepository = new CommentRepository();

    // Assert
    await expect(commentRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.verifyCommentExists('', '')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.softDeleteComment('', '', '')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
