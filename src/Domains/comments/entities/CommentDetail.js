/* eslint-disable camelcase */
class CommentDetail {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, username, date, content, is_delete,
    } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({
    id, username, date, content, is_delete,
  }) {
    if (!id || !username || !date || !content || is_delete === undefined) {
      throw new Error('COMMENT_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || !(date instanceof Date)
      || typeof content !== 'string'
      || typeof is_delete !== 'boolean'
    ) {
      throw new Error('COMMENT_DETAIL.PROPERTY_HAVE_WRONG_DATA_TYPE');
    }
  }
}

module.exports = CommentDetail;
