const Comment = require('../../Domains/comments/entities/Comment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, userId) {
    const addComment = new Comment({ ...useCasePayload, userId });
    await this._threadRepository.verifyThreadExists(addComment.threadId);
    return this._commentRepository.addComment(addComment);
  }
}
module.exports = AddCommentUseCase;
