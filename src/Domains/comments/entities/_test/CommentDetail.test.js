const CommentDetail = require('../CommentDetail');

describe('A CommentDetail entities', () => {
  it('should throw error when payload did not contain right property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload contain wrong data type', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
      content: true,
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError(
      'COMMENT_DETAIL.PROPERTY_HAVE_WRONG_DATA_TYPE',
    );
  });

  it('should throw error when payload contain wrong data type', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
      content: 'sebuah comment',
    };

    // Action
    const { id, username, date, content } = new CommentDetail(payload);

    //  Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
