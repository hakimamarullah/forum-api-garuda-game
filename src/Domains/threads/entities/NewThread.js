class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, body, userId } = payload;

    this.title = title;
    this.body = body;
    this.userId = userId;
  }

  _verifyPayload({ title, body, userId }) {
    if (!title || !body || !userId) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof userId !== 'string') {
      throw new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewThread;
