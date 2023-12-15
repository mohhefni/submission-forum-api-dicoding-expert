const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
    };

    const threadData = new ThreadDetail({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: new Date(),
      username: 'username',
      comments: [],
    });

    const commentData = [
      new CommentDetail({
        id: 'comment-123',
        username: 'user-123',
        date: new Date(),
        content: 'sebuah comment',
        is_delete: true,
      }),
      new CommentDetail({
        id: 'comment-456',
        username: 'user-123',
        date: new Date(),
        content: 'sebuah comment',
        is_delete: false,
      }),
    ];

    /** creating dependency of use case  */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking need function */
    mockThreadRepository.verifyThreadIsExist = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(threadData));
    mockCommentRepository.getCommentsThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(commentData));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    //  Action
    const detailThread = await getThreadUseCase.execute(useCasePayload);

    //  Assert
    expect(mockThreadRepository.verifyThreadIsExist).toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.getCommentsThread).toHaveBeenCalledWith(useCasePayload.thread);
    expect(detailThread).toStrictEqual(
      new ThreadDetail({
        ...threadData,
        comments: commentData,
      }),
    );
  });
});
