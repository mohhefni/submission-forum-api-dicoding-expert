const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LoginTestHelper = require('../../../../tests/LoginTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('add comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when add comment', () => {
    it('should response 401 when no authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'content comment',
      };
      const server = await createServer(container);
      const accessToken = '';

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        content: 'content comment',
      };
      const server = await createServer(container);
      const accessToken = await LoginTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      console.log(responseJson.message);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });
  });
});
