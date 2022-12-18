const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
      userId: {},
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create newThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'dicoding',
      body: 'Dicoding Indonesia',
      userId: 'user-1',
    };

    // Action
    const { title, body, userId } = new NewThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(userId).toEqual(payload.userId);
  });
});
