import { before, after, describe, it, mock } from 'node:test';
import assert from 'node:assert';

import request from 'supertest';
import expressSession from 'express-session';

import { createApp } from './app.js';

import bcrypt from 'bcrypt';

const databaseMock = {};

const sessionMiddleware = expressSession({
    secret: '123',

    resave: false,
    saveUninitialized: false,
});

const app = createApp(databaseMock, sessionMiddleware);

describe('Authentication', () => {
    describe('Logging in', () => {
        before(() => {
            databaseMock.getAccountIdAndHashFromEmail = async function (email) {
                if (email === 'incorrect@test.com') return null;
                return {
                    id: 1,
                    pwd_hash: (await bcrypt.hash('12345678', 10)),
                };
            }
        });

        after(() => {
            databaseMock.getAccountIdAndHashFromEmail = undefined;
        });

        it('should login successfully', async (context) => {
            const res = await request(app)
                .post('/api/users/auth/login')
                .send({
                    email: 'abc@test.com',
                    password: '12345678',
                });

            assert.strictEqual(res.statusCode, 302, res.body.message);
        });

        it('should not login when password incorrect', async (context) => {
            const res = await request(app)
                .post('/api/users/auth/login')
                .send({
                    email: 'abc@test.com',
                    password: '112345678',
                });

            assert.ok(
                ((res.statusCode === 401) && (res.body.message === 'Incorrect password')),
            );
        });

        it('should not login when email incorrect', async (context) => {
            const res = await request(app)
                .post('/api/users/auth/login')
                .send({
                    email: 'incorrect@test.com',
                    password: '12345678',
                });

            assert.ok(
                ((res.statusCode === 401) && (res.body.message === 'Incorrect email')),
            );
        });
    });
});