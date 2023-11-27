const AddComment = require('../AddComment');

describe('A AddComments entities', () => {
  it('should throw error when payload did not contain need property', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const payload = {
      content: true,
      thread: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPESIFICATION',
    );
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'comment content',
      thread: 'thread-123',
      owner: 'user-123',
    };

    // Action
    const { content, thread, owner } = new AddComment(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(thread).toEqual(payload.thread);
    expect(owner).toEqual(payload.owner);
  });
});
