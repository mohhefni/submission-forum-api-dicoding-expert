const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  const userId1 = 'user-123';
  const username1 = 'hefni';
  const userId2 = 'user-456';
  const username2 = 'moh';
  const threadId = 'thread-123';
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: userId1, username: username1 });
    await UsersTableTestHelper.addUser({ id: userId2, username: username2 });
    await ThreadsTableTestHelper.addThread({ id: threadId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new payload', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'comment content',
        thread: threadId,
        owner: userId1,
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'comment content',
        thread: threadId,
        owner: userId1,
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'comment content',
          owner: userId1,
        }),
      );
    });
  });

  describe('verifyCommentIsExist function', () => {
    it('should return NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(commentRepositoryPostgres.verifyCommentIsExist('wrong-id')).rejects.toThrowError(
        NotFoundError,
      );
    });

    it('should not return NotFoundError when comment found', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'comment content',
        thread: threadId,
        owner: userId1,
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      await expect(
        commentRepositoryPostgres.verifyCommentIsExist('comment-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should return AuthorizationError when comment not found', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'comment content',
        thread: threadId,
        owner: userId1,
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'wrong-userId'),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not return AuthorizationError when comment found', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'comment content',
        thread: threadId,
        owner: userId1,
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', userId1),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should not NotFoundError when comment not found', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'comment content',
        thread: threadId,
        owner: userId1,
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(addComment);

      // Action and Assert
      await expect(
        commentRepositoryPostgres.deleteCommentById('wrong-id'),
      ).rejects.toThrowError(NotFoundError);
    });
    it('should delete comment by id correctly ', async () => {
      // Arrange
      const commentId = 'comment-123';
      const addComment = new AddComment({
        content: 'comment content',
        thread: threadId,
        owner: userId1,
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(addComment);

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);
      const comments = await CommentsTableTestHelper.findCommentById(commentId);

      // Assert
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsThread function', () => {
    it('should return detail comment by threadId correctly ', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content comment 1',
        thread: threadId,
        owner: userId1,
        is_delete: false,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        content: 'content comment 2',
        thread: threadId,
        owner: userId2,
        is_delete: true,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsThread(threadId);

      // Assert
      expect(Array.isArray(comments)).toBe(true);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].username).toEqual(username1);
      expect(comments[0].date).toBeDefined();
      expect(comments[0].content).toEqual('content comment 1');
      expect(comments[1].id).toEqual('comment-456');
      expect(comments[1].username).toEqual(username2);
      expect(comments[1].date).toBeDefined();
      expect(comments[1].content).toEqual('**komentar telah dihapus**');
    });
  });
});
