const AddCommentReplyUseCase = require('../../../../Applications/use_case/AddCommentReplyUseCase');
const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
  }

  async postCommentHandler({ auth, payload, params }, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { threadId } = params;
    const addedComment = await addCommentUseCase
      .execute({ ...payload, threadId }, auth.credentials.id);

    return h.response({
      status: 'success',
      data: {
        addedComment,
      },
    }).code(201);
  }
}

module.exports = CommentHandler;
