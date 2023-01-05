class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(payload) {
    const { threadId } = payload;
    const {
      id, title, body, date, username, comments,
    } = await this._threadRepository.getThreadDetails(threadId);

    const commentsLikeCount = await this._commentRepository.getCommentsLikes(threadId);
    const likeDictionary = Object
      .fromEntries(commentsLikeCount?.map((data) => [data.commentId, Number(data.likeCount)]));
    const newComments = this.updateDeletedCommentAndReplyContent(comments, likeDictionary);
    const result = {
      id, title, body, date, username, comments: newComments,
    };
    return result;
  }

  updateDeletedReplyContent(replies) {
    const res = replies?.map((reply) => {
      const rep = { ...reply, content: reply.deleted ? '**balasan telah dihapus**' : reply.content };
      delete rep.deleted;
      return rep;
    });
    return res.sort((a, b) => a.date - b.date);
  }

  updateDeletedCommentAndReplyContent(comments, likeDictionary) {
    const res = comments?.map((comment) => {
      const com = {
        ...comment,
        content: comment.deleted ? '**komentar telah dihapus**' : comment.content,
        likeCount: likeDictionary[comment.id] || 0,
        replies: this.updateDeletedReplyContent(comment.replies),
      };
      delete com.deleted;
      return com;
    });

    return res.sort((a, b) => a.date - b.date);
  }
}

module.exports = GetThreadDetailsUseCase;
