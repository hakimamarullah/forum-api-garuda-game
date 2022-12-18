const AddCommentReplyUseCase = require('../../../../Applications/use_case/AddCommentReplyUseCase');
const DeleteCommentReplyUseCase = require('../../../../Applications/use_case/DeleteCommentReplyUseCase');

class ReplyCommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
    this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this);
  }

  async postCommentReplyHandler({ auth, params, payload }, h) {
    const addCommentReplyUseCase = this._container.getInstance(AddCommentReplyUseCase.name);
    const { threadId, commentId } = params;
    const { id: userId } = auth.credentials;
    const { content } = payload;

    const addedReply = await addCommentReplyUseCase
      .execute({
        threadId, commentId, userId, content,
      });

    return h.response({
      status: 'success',
      data: {
        addedReply,
      },
    }).code(201);
  }

  async deleteCommentReplyHandler({ auth, params }) {
    const deleteThreadCommentUseCase = this._container.getInstance(DeleteCommentReplyUseCase.name);
    const { threadId, commentId, replyId } = params;
    const { id: userId } = auth.credentials;

    const payload = {
      threadId, commentId, userId, replyId,
    };

    await deleteThreadCommentUseCase.execute(payload);

    return {
      status: 'success',
    };
  }
}

module.exports = ReplyCommentHandler;
