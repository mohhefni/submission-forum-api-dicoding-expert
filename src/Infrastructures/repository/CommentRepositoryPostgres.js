const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, thread, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, thread, owner],
    };

    const { rows } = await this._pool.query(query);

    return new AddedComment({ ...rows[0] });
  }

  async verifyCommentIsExist(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new AuthorizationError('tidak dapat mengakses resource ini');
    }
  }

  async getCommentsThread(threadId) {
    const query = {
      text: 'SELECT comments.id AS id, users.username AS username, comments.created_at AS date, comments.content AS content, comments.is_delete as is_delete FROM comments JOIN users ON comments.owner = users.id WHERE comments.id = $1',
      values: [threadId],
    };

    const { rowCount, rows } = await this._pool.query(query);

    if (rowCount) {
      return [];
    }

    return this.GroupRepliesByComments(rows);
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus comment');
    }
  }
}

module.exports = CommentRepositoryPostgres;
