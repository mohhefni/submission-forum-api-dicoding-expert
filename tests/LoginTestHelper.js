/* istanbul ignore file */
const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const LoginTestHelper = {
  async getAccessToken() {
    const payload = {
      id: 'user-123',
      username: 'dicoding',
    };

    await UsersTableTestHelper.addUser(payload);
    return Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = LoginTestHelper;
