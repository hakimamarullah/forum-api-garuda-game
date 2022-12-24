class GetThreadDetailsUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const { threadId } = payload;
    const {
      id, title, body, date, username, comments,
    } = await this._threadRepository.getThreadDetails(threadId);

    const newComments = this.updateDeletedCommentAndReplyContent(comments);
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

  updateDeletedCommentAndReplyContent(comments) {
    const res = comments?.map((comment) => {
      const com = {
        ...comment,
        content: comment.deleted ? '**komentar telah dihapus**' : comment.content,
        replies: this.updateDeletedReplyContent(comment.replies),
      };
      delete com.deleted;
      return com;
    });

    return res.sort((a, b) => a.date - b.date);
  }
}

module.exports = GetThreadDetailsUseCase;
