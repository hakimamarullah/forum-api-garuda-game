class AddCommentReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    return this._replyRepository.addCommentReply(useCasePayload);
  }

  _validatePayload({
    threadId, commentId, userId, content,
  }) {
    if (!threadId || !userId || !commentId || !content) {
      throw new Error('ADD_COMMENT_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_ATTRIBUTE');
    }

    if (typeof threadId !== 'string' || typeof userId !== 'string' || typeof commentId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT_REPLY_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = AddCommentReplyUseCase;
