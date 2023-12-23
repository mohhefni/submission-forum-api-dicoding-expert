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
    const threadId = 'thread-123';

    const mockCommentThread = [
      new CommentDetail({
        id: 'comment-123',
        username: 'dicoding',
        date: new Date('2023-12-23T22:27:36.010Z'),
        content: 'sebuah konten comment',
        is_delete: true,
      }),
      new CommentDetail({
        id: 'comment-456',
        username: 'dicoding',
        date: new Date('2023-12-23T22:28:26.853Z'),
        content: 'sebuah konten comment',
        is_delete: false,
      }),
    ];
    const mockDetailThread = new ThreadDetail({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'body sebuah thread',
      date: new Date('2023-12-23T22:23:30.299Z'),
      username: 'dicoding',
    });

    /** creating dependency of use case  */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking need function */
    mockThreadRepository.verifyThreadIsExist = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(
        new ThreadDetail({
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'body sebuah thread',
          date: new Date('2023-12-23T22:23:30.299Z'),
          username: 'dicoding',
        }),
      ));
    mockCommentRepository.getCommentsThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(
        [
          new CommentDetail({
            id: 'comment-123',
            username: 'dicoding',
            date: new Date('2023-12-23T22:27:36.010Z'),
            content: 'sebuah konten comment',
            is_delete: true,
          }),
          new CommentDetail({
            id: 'comment-456',
            username: 'dicoding',
            date: new Date('2023-12-23T22:28:26.853Z'),
            content: 'sebuah konten comment',
            is_delete: false,
          }),
        ],
      ));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    //  Action
    const detailThread = await getThreadUseCase.execute(threadId);

    //  Assert
    expect(mockThreadRepository.verifyThreadIsExist).toHaveBeenCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.getCommentsThread).toHaveBeenCalledWith(threadId);
    expect(detailThread).toStrictEqual({ ...mockDetailThread, comments: mockCommentThread });
  });
});
