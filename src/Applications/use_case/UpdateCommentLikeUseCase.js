class updateCommentLikeUseCase {
  constructor({ threadRepository, commentRepository }) {
    this.threadRepository = threadRepository;
    this.commentRepository = commentRepository;
  }
}

module.exports = updateCommentLikeUseCase;
