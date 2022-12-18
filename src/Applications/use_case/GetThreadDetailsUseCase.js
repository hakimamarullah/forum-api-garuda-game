class GetThreadDetailsUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload) {
    const { threadId } = payload;
    return this._threadRepository.getThreadDetails(threadId);
  }
}

module.exports = GetThreadDetailsUseCase;
