/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'content comment',
    thread = 'thread-123',
    owner = 'user-123',
    is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5)',
      values: [id, content, thread, owner, is_delete],
    };

    await pool.query(query);
  },

  async findCommentById(commentId) {
    const query = {
      text: 'SELECT * FROM comments where id = $1',
      values: [commentId],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments');
  },
};

module.exports = CommentsTableTestHelper;
