import {  FastifyInstance } from 'fastify';
import { test } from 'tap';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { comments } from '../../db/schema';
import { build } from '../../app';
import supertest from 'supertest'
require('@dotenvx/dotenvx').config()

async function createTestDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL, // Ensure you have DATABASE_URL set
  });
  await client.connect();
  const db = drizzle(client);

  // Clear existing comments and insert test data
  await db.delete(comments);
  await db.insert(comments).values([
    { postId: 1, name: 'John Doe', email: 'john.doe@example.com', body: 'This is a test comment.' },
    { postId: 2, name: 'Jane Smith', email: 'jane.smith@example.com', body: 'Another comment with some words.' },
    { postId: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', body: 'Search term test.' },
    { postId: 4, name: 'Bob Williams', email: 'bob.williams@example.com', body: 'Testing search functionality.' },
    { postId: 5, name: 'Charlie Brown', email: 'charlie.brown@example.com', body: 'More comments for pagination.' },
    { postId: 6, name: 'David Lee', email: 'david.lee@example.com', body: 'And even more comments.' },
    { postId: 7, name: 'Eva Davis', email: 'eva.davis@example.com', body: 'Another one to test limits.' },
    { postId: 8, name: 'Frank Wilson', email: 'frank.wilson@example.com', body: 'And another one.' },
    { postId: 9, name: 'Grace Martinez', email: 'grace.martinez@example.com', body: 'More for pagination testing.' },
    { postId: 10, name: 'Henry Anderson', email: 'henry.anderson@example.com', body: 'Last one for now.' },
    { postId: 11, name: 'SearchTermUser', email: 'searchterm@example.com', body: 'This is a test with SearchTerm.' },
  ]);

  return { db, client };
}

test('GET /comments', async (t) => {
  let fastify: FastifyInstance;
  let client: Client;

  t.beforeEach(async () => {
    const testDb = await createTestDb();
    client = testDb.client;
    fastify = build();
    await fastify.ready();
  });

  t.afterEach(async () => {
    await fastify.close();
    await client.end();
  });

  t.test('should return comments with default pagination', async (t) => {
    
    const fastify = build()

    t.after(() => fastify.close())
  
    await fastify.ready()
  
    const response = await supertest(fastify.server)
      .get('/comments')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
    t.equal(response.statusCode, 200);

    const body = response.body;
    t.equal(body.data.length, 10);
    t.equal(body.total, 11);
    t.equal(body.page, 1);
    t.equal(body.limit, 10);
  });

  t.test('should return comments with specified limit and page', async (t) => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/comments?limit=5&page=2',
    });

    t.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    t.equal(body.data.length, 5);
    t.equal(body.total, 11);
    t.equal(body.page, 2);
    t.equal(body.limit, 5);
  });

  t.test('should return comments with search term', async (t) => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/comments?searchterm=SearchTerm',
    });

    t.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    t.equal(body.data.length, 1);
    t.equal(body.total, 1);
    t.equal(body.page, 1);
    t.equal(body.limit, 10);
  });

  t.test('should return comments with search term and pagination', async (t) => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/comments?searchterm=test&limit=5&page=1',
    });

    t.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    t.equal(body.data.length, 3);
    t.equal(body.total, 3);
    t.equal(body.page, 1);
    t.equal(body.limit, 5);
  });

  t.test('should handle invalid limit and page values', async (t) => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/comments?limit=abc&page=def',
    });

    t.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    t.equal(body.data.length, 10);
    t.equal(body.total, 11);
    t.equal(body.page, 1);
    t.equal(body.limit, 10);
  });

  t.test('should limit limit to 50', async (t) => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/comments?limit=100',
    });

    t.equal(response.statusCode, 200);
    const body = JSON.parse(response.payload);
    t.equal(body.limit, 50);
  });

  t.end();
});