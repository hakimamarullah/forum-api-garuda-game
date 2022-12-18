const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler({ auth, payload }, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(payload, auth.credentials.id);

    return h.response({
      status: 'success',
      data: {
        addedThread,
      },
    }).code(201);
  }
}

module.exports = ThreadHandler;
