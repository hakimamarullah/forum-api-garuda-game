class DeleteCommentReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    await this._replyRepository.verifyCommentExists(useCasePayload);
    await this._replyRepository.softDeleteCommentReply(useCasePayload);
    return { status: 'success' };
  }

  _validatePayload({
    threadId, commentId, userId, replyId,
  }) {
    if (!threadId || !userId || !commentId || !replyId) {
      throw new Error('DELETE_COMMENT_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_ATTRIBUTE');
    }

    if (typeof threadId !== 'string' || typeof userId !== 'string' || typeof commentId !== 'string' || typeof replyId !== 'string') {
      throw new Error('DELETE_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentReplyUseCase;
