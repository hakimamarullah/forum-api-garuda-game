const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const UpdateCommentLikeUseCase = require('../../../../Applications/use_case/UpdateCommentLikeUseCase');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.putCommentLikeHandler = this.putCommentLikeHandler.bind(this);
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

  async putCommentLikeHandler({ auth, params }, h) {
    const updateCommentLikeUseCase = this._container.getInstance(UpdateCommentLikeUseCase.name);
    const { threadId, commentId } = params;
    const { id: userId } = auth.credentials;
    const useCasePayload = { userId, threadId, commentId };
    await updateCommentLikeUseCase.execute(useCasePayload);

    return { status: 'success' };
  }
}

module.exports = CommentHandler;
