const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('hould throw error when invoke abstract behavior', () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action and Assert
    expect(threadRepository.addThread).toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
