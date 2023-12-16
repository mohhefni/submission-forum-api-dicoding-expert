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

  it('should create CommentDetail object correctly', () => {
    // Arrange
    const payloadFirstComment = {
      id: 'comment-123',
      username: 'user-123',
      date: new Date(),
      content: 'sebuah comment',
      is_delete: true,
    };
    const payloadSecondComment = {
      id: 'comment-456',
      username: 'user-123',
      date: new Date(),
      content: 'sebuah comment',
      is_delete: false,
    };

    // Action
    const firstComment = new CommentDetail(payloadFirstComment);
    const secondComment = new CommentDetail(payloadSecondComment);

    //  Assert
    // First Comment
    expect(firstComment.id).toEqual(payloadFirstComment.id);
    expect(firstComment.username).toEqual(payloadFirstComment.username);
    expect(firstComment.date).toEqual(payloadFirstComment.date);
    expect(firstComment.content).toEqual('**komentar telah dihapus**');
    // Second Comment
    expect(secondComment.id).toEqual(payloadSecondComment.id);
    expect(secondComment.username).toEqual(payloadSecondComment.username);
    expect(secondComment.date).toEqual(payloadSecondComment.date);
    expect(secondComment.content).toEqual(payloadSecondComment.content);
  });
});
