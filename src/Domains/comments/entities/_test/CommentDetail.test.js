const CommentDetail = require('../CommentDetail');

describe('A CommentDetail entities', () => {
  it('should throw error when payload did not contain right property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: new Date(),
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
      date: new Date(),
      content: true,
      is_delete: true,
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
      date: new Date(),
      content: 'sebuah comment',
      is_delete: true,
    };

    // Action
    const { id, username, date, content } = new CommentDetail(payload);

    //  Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**komentar telah dihapus**');
  });
});
