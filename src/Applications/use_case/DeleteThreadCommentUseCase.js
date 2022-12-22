class DeleteThreadCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { threadId, ownerId, commentId } = useCasePayload;
    await this._commentRepository.verifyCommentExists(threadId, commentId);
    await this._commentRepository.verifyCommentOwner(commentId, ownerId);
    await this._commentRepository.softDeleteComment(threadId, commentId, ownerId);
    return { status: 'success' };
  }

  _validatePayload({ threadId, ownerId, commentId }) {
    if (!threadId || !ownerId || !commentId) {
      throw new Error('DELETE_THREAD_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_ATTRIBUTE');
    }

    if (typeof threadId !== 'string' || typeof ownerId !== 'string' || typeof commentId !== 'string') {
      throw new Error('DELETE_THREAD_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteThreadCommentUseCase;
