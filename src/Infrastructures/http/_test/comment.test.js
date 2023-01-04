const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/threadId/comments endpoint', () => {
  let token = '';
  let thread = {};
  let comment = {};
  beforeAll(async () => {
    const requestPayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const server = await createServer(container);
    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestPayload,
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    token = responseJson.data.accessToken;
  });

  afterAll(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads/threadId/comments', () => {
    it('should response 201 and persisted comments', async () => {
      // Arrange
      const requestPayload = {
        title: 'integration test threads',
        body: 'body',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      thread = responseJson.data.addedThread;

      const commentRequestPayload = {
        content: 'sebuah comment',
      };

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments`,
        payload: commentRequestPayload,
        headers: { Authorization: `Bearer ${token}` },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      comment = commentResponseJson.data.addedComment;
      expect(commentResponse.statusCode).toEqual(201);
      expect(commentResponseJson.status).toEqual('success');
      expect(commentResponseJson.data.addedComment).toBeDefined();
      expect(commentResponseJson.data.addedComment.id).toBeDefined();
      expect(commentResponseJson.data.addedComment.content).toEqual(commentRequestPayload.content);
      expect(commentResponseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 200 after deleting thread comment', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(response.result.status).toEqual('success');
    });
  });
});

describe('when PUT /threads/threadId/comments/commentId/likes', async () => {
  let thread = {};
  let comment = {};
  let token = '';
  const server = await createServer(container);
  beforeAll(async () => {
    const requestLogin = {
      username: 'dicoding',
      password: 'secret',
    };
    // add user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // Action
    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: requestLogin,
    });

    // Assert
    token = JSON.parse(responseAuth.payload).data.accessToken;

    // Arrange
    const requestThread = {
      title: 'integration test threads',
      body: 'body',
    };

    // Action
    const responseThread = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestThread,
      headers: { Authorization: `Bearer ${token}` },
    });

    // Assert
    thread = JSON.parse(responseThread.payload).data.addedThread;

    const commentRequestPayload = {
      content: 'sebuah comment',
    };

    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${thread.id}/comments`,
      payload: commentRequestPayload,
      headers: { Authorization: `Bearer ${token}` },
    });

    comment = JSON.parse(commentResponse.payload).data.addedComment;
  });
  it('should response 200 and likeCount increased', async () => {
    const likeResponse = await server.inject({
      method: 'PUT',
      url: `/threads/${thread.id}/comments/${comment.id}/likes`,
      headers: { Authorization: `Bearer ${token}` },
    });

    const likeResponseJson = JSON.parse(likeResponse.payload);
    expect(likeResponse.statusCode).toEqual(200);
    expect(likeResponseJson.status).toEqual('success');
    expect(likeResponseJson.data.addedComment).toBeDefined();
    expect(likeResponseJson.data.addedComment.id).toBeDefined();
    expect(likeResponseJson.data.addedComment.owner).toBeDefined();
    expect(likeResponseJson.data.addedComment.likeCount).toBeDefined();
    expect(likeResponseJson.data.addedComment.likeCount).toEqual(1);
    expect(likeResponseJson.data.addedComment.content).toEqual(comment.content);
  });

  it('should response 200 and likeCount decreased', async () => {
    const likeResponse = await server.inject({
      method: 'PUT',
      url: `/threads/${thread.id}/comments/${comment.id}/likes`,
      headers: { Authorization: `Bearer ${token}` },
    });

    const likeResponseJson = JSON.parse(likeResponse.payload);
    expect(likeResponse.statusCode).toEqual(200);
    expect(likeResponseJson.status).toEqual('success');
    expect(likeResponseJson.data.addedComment).toBeDefined();
    expect(likeResponseJson.data.addedComment.id).toBeDefined();
    expect(likeResponseJson.data.addedComment.owner).toBeDefined();
    expect(likeResponseJson.data.addedComment.likeCount).toBeDefined();
    expect(likeResponseJson.data.addedComment.likeCount).toEqual(0);
    expect(likeResponseJson.data.addedComment.content).toEqual(comment.content);
  });

  it('should response 404 when thread not found', async () => {
    const likeResponse = await server.inject({
      method: 'PUT',
      url: `/threads/xxx/comments/${comment.id}/likes`,
      headers: { Authorization: `Bearer ${token}` },
    });

    const likeResponseJson = JSON.parse(likeResponse.payload);
    expect(likeResponse.statusCode).toEqual(404);
    expect(likeResponseJson.status).toEqual('fail');
    expect(likeResponseJson.message).toBeInstanceOf(String);
    expect(likeResponseJson.message).not.toEqual('');
  });

  it('should response 404 when comment not found', async () => {
    const likeResponse = await server.inject({
      method: 'PUT',
      url: `/threads/${thread.id}/comments/xxx/likes`,
      headers: { Authorization: `Bearer ${token}` },
    });

    const likeResponseJson = JSON.parse(likeResponse.payload);
    expect(likeResponse.statusCode).toEqual(404);
    expect(likeResponseJson.status).toEqual('fail');
    expect(likeResponseJson.message).toBeInstanceOf(String);
    expect(likeResponseJson.message).not.toEqual('');
  });
});
