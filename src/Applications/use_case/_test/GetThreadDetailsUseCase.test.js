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
    const date = new Date();
    // eslint-disable-next-line no-promise-executor-return
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(2000);

    const date2 = new Date();

    const mockReturnValue = {
      id: 'thread-vcoLlcvzPDxEGDAtPNwsD',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: date2,
      username: 'dicoding',
      comments: [
        {
          id: 'comment-YUYBSOc3IkFFsOm1fY0hn',
          username: 'johndoe',
          date: date2,
          content: 'sebuah comment',
          deleted: true,
          replies: [
            {
              id: 'reply-YUYBSOc3IkFFsOm1fY0hn',
              username: 'johndoe',
              date: date2,
              deleted: true,
              content: 'sebuah balasan',
            },
            {
              id: 'reply-YUYBSOc3IkFFsOm1fY1hn',
              username: 'johndoe',
              date,
              deleted: true,
              content: 'sebuah balasan',
            }],
        },
        {
          id: 'comment-phzTzJz3OREZwSVDbkbGI',
          username: 'dicoding',
          date,
          content: 'sebuah comment',
          deleted: false,
          replies: [
            {
              id: 'reply-phzTzJz3OREZwSVDbkbGI',
              username: 'dicoding',
              date: date2,
              deleted: true,
              content: 'sebuah balasan 2',
            },
            {
              id: 'reply-phzTzJz3OREZwSVDbkbGy',
              username: 'dicoding',
              date,
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
      date: date2,
      username: 'dicoding',
      comments: [
        {
          id: 'comment-phzTzJz3OREZwSVDbkbGI',
          username: 'dicoding',
          date,
          content: 'sebuah comment',
          replies: [
            {
              id: 'reply-phzTzJz3OREZwSVDbkbGy',
              username: 'dicoding',
              date,
              content: 'sebuah balasan 2',
            },
            {
              id: 'reply-phzTzJz3OREZwSVDbkbGI',
              username: 'dicoding',
              date: date2,
              content: '**balasan telah dihapus**',
            }],
        },
        {
          id: 'comment-YUYBSOc3IkFFsOm1fY0hn',
          username: 'johndoe',
          date: date2,
          content: '**komentar telah dihapus**',
          replies: [
            {
              id: 'reply-YUYBSOc3IkFFsOm1fY1hn',
              username: 'johndoe',
              date,
              content: '**balasan telah dihapus**',
            },
            {
              id: 'reply-YUYBSOc3IkFFsOm1fY0hn',
              username: 'johndoe',
              date: date2,
              content: '**balasan telah dihapus**',
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

    // Check ordered Reply and Comments By Date
    expect(result.comments[0].id).toEqual('comment-phzTzJz3OREZwSVDbkbGI');
    expect(result.comments[1].id).toEqual('comment-YUYBSOc3IkFFsOm1fY0hn');

    expect(result.comments[0].replies[0].id).toEqual('reply-phzTzJz3OREZwSVDbkbGy');
    expect(result.comments[0].replies[1].id).toEqual('reply-phzTzJz3OREZwSVDbkbGI');

    expect(result.comments[1].replies[0].id).toEqual('reply-YUYBSOc3IkFFsOm1fY1hn');
    expect(result.comments[1].replies[1].id).toEqual('reply-YUYBSOc3IkFFsOm1fY0hn');
  });
});
