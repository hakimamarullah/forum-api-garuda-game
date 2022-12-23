const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');

describe('GetThreadDetailsUseCase', () => {
  it('should orchestrating the get thread details action correctly', async () => {
    // Arrange
    const payload = { threadId: 'thread-123' };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadDetails = jest.fn().mockImplementation(() => Promise.resolve(
      {
        id: 'thread-vcoLlcvzPDxEGDAtPNwsD',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        date: '2022-12-22T11:13:34.754Z',
        username: 'dicoding',
        comments: [],
      },
    ));

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    await getThreadDetailsUseCase.execute(payload);

    // Assert
    expect(mockThreadRepository.getThreadDetails).toHaveBeenCalledWith(payload.threadId);
    expect(mockThreadRepository.getThreadDetails).toBeCalledTimes(1);
  });

  it('should orchestrating the get thread details action correctly and return expected object', async () => {
    // Arrange
    const payload = { threadId: 'thread-123' };

    const mockReturnValue = {
      id: 'thread-vcoLlcvzPDxEGDAtPNwsD',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2022-12-22T11:13:34.754Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-YUYBSOc3IkFFsOm1fY0hn',
          username: 'johndoe',
          date: '2022-12-22T11:13:47.889Z',
          content: 'sebuah comment',
          deleted: false,
          replies: [{
            id: 'reply-YUYBSOc3IkFFsOm1fY0hn',
            username: 'johndoe',
            date: '2022-12-22T11:13:47.889Z',
            deleted: true,
            content: 'sebuah balasan',
          }],
        },
        {
          id: 'comment-phzTzJz3OREZwSVDbkbGI',
          username: 'dicoding',
          date: '2022-12-22T11:13:51.909Z',
          content: 'sebuah comment',
          deleted: true,
          replies: [{
            id: 'reply-phzTzJz3OREZwSVDbkbGI',
            username: 'dicoding',
            date: '2022-12-22T11:13:51.909Z',
            deleted: false,
            content: 'sebuah balasan 2',
          }],
        },
      ],
    };

    const expectedThreadDetails = {
      id: 'thread-vcoLlcvzPDxEGDAtPNwsD',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2022-12-22T11:13:34.754Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-YUYBSOc3IkFFsOm1fY0hn',
          username: 'johndoe',
          date: '2022-12-22T11:13:47.889Z',
          content: 'sebuah comment',
          replies: [{
            id: 'reply-YUYBSOc3IkFFsOm1fY0hn',
            username: 'johndoe',
            date: '2022-12-22T11:13:47.889Z',
            content: '**balasan telah dihapus**',
          }],
        },
        {
          id: 'comment-phzTzJz3OREZwSVDbkbGI',
          username: 'dicoding',
          date: '2022-12-22T11:13:51.909Z',
          content: '**komentar telah dihapus**',
          replies: [{
            id: 'reply-phzTzJz3OREZwSVDbkbGI',
            username: 'dicoding',
            date: '2022-12-22T11:13:51.909Z',
            content: 'sebuah balasan 2',
          }],
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.getThreadDetails = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockReturnValue));

    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const result = await getThreadDetailsUseCase.execute(payload);

    // Assert
    expect(mockThreadRepository.getThreadDetails).toHaveBeenCalledWith(payload.threadId);
    expect(mockThreadRepository.getThreadDetails).toBeCalledTimes(1);

    expect(result.id).toBeDefined();
    expect(result.title).toBeDefined();
    expect(result.body).toBeDefined();
    expect(result.date).toBeDefined();
    expect(result.username).toBeDefined();

    // Check comments property
    expect(result).toStrictEqual(expectedThreadDetails);
  });
});
