const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');

describe('GetThreadDetailsUseCase', () => {
  it('should orchestrating the get thread details action correctly', async () => {
    // Arrange
    const payload = { threadId: 'thread-123' };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadDetails = jest.fn().mockImplementation(() => Promise.resolve());

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await getThreadDetailsUseCase.execute(payload);

    // Assert
    expect(mockThreadRepository.getThreadDetails).toHaveBeenCalledWith(payload.threadId);
    expect(mockThreadRepository.getThreadDetails).toBeCalledTimes(1);
  });
});
