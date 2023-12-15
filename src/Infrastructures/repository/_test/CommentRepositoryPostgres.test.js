const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');
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
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: userId1, username: username1 });
    await UsersTableTestHelper.addUser({ id: userId2, username: username2 });
    await ThreadsTableTestHelper.addThread({ id: threadId });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
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
    it('should ', async () => {
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
      const [firstComment] = await CommentsTableTestHelper.findCommentById('comment-123');
      const [secondComment] = await CommentsTableTestHelper.findCommentById('comment-456');
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsThread('thread-123');

      // Assert
      expect(comments).toStrictEqual([
        new CommentDetail({
          id: firstComment.id,
          username: username1,
          date: firstComment.created_at,
          content: firstComment.content,
          is_delete: firstComment.is_delete,
        }),
        new CommentDetail({
          id: secondComment.id,
          username: username2,
          date: secondComment.created_at,
          content: secondComment.content,
        }),
      ]);
    });
  });
});
