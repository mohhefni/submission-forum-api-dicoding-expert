class ThreadDetail {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, title, body, date, username,
    } = payload;
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
  }

  _verifyPayload({
    id, title, body, date, username,
  }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof title !== 'string'
      || typeof body !== 'string'
      || !(date instanceof Date)
      || typeof username !== 'string'
    ) {
      throw new Error('THREAD_DETAIL.PROPERTY_HAVE_WRONG_DATA_TYPE');
    }
  }
}

module.exports = ThreadDetail;
