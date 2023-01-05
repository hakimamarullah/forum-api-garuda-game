class updateCommentLikeUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }

  async execute(payload) {
    this._validatePayload(payload);
    const { threadId, commentId, userId } = payload;
    await this.threadRepository.verifyThreadExists(threadId);
    await this.commentRepository.verifyCommentExists(threadId, commentId);
    const updated = await this.commentRepository.updateCommentLike(userId, commentId, threadId);
    return updated;
  }

  _validatePayload({
    threadId, commentId, userId,
  }) {
    if (!threadId || !userId || !commentId) {
      throw new Error('UPDATE_COMMENT_LIKE_USE_CASE.NOT_CONTAIN_NEEDED_ATTRIBUTE');
    }

    if (typeof threadId !== 'string' || typeof userId !== 'string' || typeof commentId !== 'string') {
      throw new Error('UPDATE_COMMENT_LIKE_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = updateCommentLikeUseCase;
