const ThreadDetail = require('../ThreadDetail');
describe('A ThreadDetail entities', () => {
  it('should throw error when payload did not contain right property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      username: 'dicoding',
      replies: [],
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError(
      'THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload contain wrong data type', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'username',
      comments: true,
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError(
      'THREAD_DETAIL.PROPERTY_HAVE_WRONG_DATA_TYPE',
    );
  });

  it('should throw error when payload contain wrong data type', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'username',
      comments: [],
    };

    // Action
    const { id, title, body, date, username, comments } = new ThreadDetail(payload);

    //  Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
