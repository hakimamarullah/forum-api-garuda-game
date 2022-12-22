/* eslint-disable max-len */
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ReplyTableTestHelper = require('../../../../tests/ReplyTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  let token = '';
  let thread = {};
  let comment = {};
  let reply = {};
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
    await ReplyTableTestHelper.cleanTable();
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

      const replyRequestPayload = {
        content: 'sebuah balasan',
      };

      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${thread.id}/comments/${comment.id}/replies`,
        payload: replyRequestPayload,
        headers: { Authorization: `Bearer ${token}` },
      });

      const replyResponseJson = JSON.parse(replyResponse.payload);
      reply = replyResponseJson.data.addedReply;

      expect(commentResponse.statusCode).toEqual(201);
      expect(replyResponseJson.status).toEqual('success');
      expect(replyResponseJson.data.addedReply).toBeDefined();
      expect(replyResponseJson.data.addedReply.id).toBeDefined();
      expect(replyResponseJson.data.addedReply.content).toEqual(replyRequestPayload.content);
      expect(replyResponseJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 200 after deleting comment\'s reply', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${thread.id}/comments/${comment.id}/replies/${reply.id}`,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(response.result.status).toEqual('success');
    });
  });
});
