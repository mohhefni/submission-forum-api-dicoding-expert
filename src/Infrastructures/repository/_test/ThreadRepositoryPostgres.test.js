const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  const userId = 'user-123';
  const userName = 'hefni';
  // beforeAll(async () => {
  //   await UsersTableTestHelper.addUser({ id: userId, username: userName });
  // });

  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: userId, username: userName });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new payload', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'thread title',
          owner: 'user-123',
        }),
      );
    });
  });

  describe('verifyThreadIsExist function', () => {
    it('should return NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.verifyThreadIsExist('wrong-id')).rejects.toThrowError(
        NotFoundError,
      );
    });

    it('should not return NotFoundError when thread found', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'thread title',
        body: 'thread body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      await expect(
        threadRepositoryPostgres.verifyThreadIsExist('thread-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });

    describe('getThreadById funnction', () => {
      it('should not NotFoundError when thread not found', async () => {
        // Arrange
        const addThread = new AddThread({
          title: 'thread title',
          body: 'thread body',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
        await threadRepositoryPostgres.addThread(addThread);

        // Action and Assert
        await expect(
          threadRepositoryPostgres.getThreadById('wrong-id'),
        ).rejects.toThrowError(NotFoundError);
      });
      it('should return detail thread correctly', async () => {
        // Arrange
        const addThread = new AddThread({
          title: 'thread title',
          body: 'thread body',
          owner: 'user-123',
        });

        const fakeIdGenerator = () => '123';
        const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
        await threadRepositoryPostgres.addThread(addThread);

        // Action
        const thread = await threadRepositoryPostgres.getThreadById('thread-123');

        // Assert
        expect(thread.id).toStrictEqual('thread-123');
        expect(thread.title).toStrictEqual('thread title');
        expect(thread.body).toStrictEqual('thread body');
        expect(thread.username).toStrictEqual('hefni');
        expect(thread.date).toBeDefined();
      });
    });
  });
});
