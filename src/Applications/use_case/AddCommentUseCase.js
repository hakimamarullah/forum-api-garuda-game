const Comment = require('../../Domains/comments/entities/Comment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, userId) {
    const addComment = new Comment({ ...useCasePayload, userId });
    return this._commentRepository.addComment(addComment);
  }
}
module.exports = AddCommentUseCase;
