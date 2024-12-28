import { before, after, describe, it, mock } from 'node:test';
import assert from 'node:assert';

import request from 'supertest';
import session from 'supertest-session';
import expressSession from 'express-session';

import { createApp } from './app.js';

import bcrypt from 'bcrypt';

const databaseMock = {};
const utilityMock = {};

const sessionMiddleware = expressSession({
    secret: '123',

    resave: false,
    saveUninitialized: false,
});

const app = createApp(databaseMock, sessionMiddleware, utilityMock);

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
            const passedAttempt = await request(app)
                .post('/api/v1/users/auth/login')
                .send({
                    email: 'abc@test.com',
                    password: '12345678',
                });

            assert.strictEqual(passedAttempt.statusCode, 302, passedAttempt.body.message);
        });

        it('should not login if already logged in', async (context) => {
            const testSession = session(app);

            const passedAttempt = await testSession
                .post('/api/v1/users/auth/login')
                .send({
                    email: 'abc@test.com',
                    password: '12345678',
                });

            assert.strictEqual(passedAttempt.statusCode, 302, passedAttempt.body.message);

            const failedAttempt = await testSession
                .post('/api/v1/users/auth/login')
                .send({
                    email: 'abc@test.com',
                    password: '12345678',
                });
            
            assert.strictEqual(failedAttempt.statusCode, 400);
        });

        it('should not login when password incorrect', async (context) => {
            const failedAttempt = await request(app)
                .post('/api/v1/users/auth/login')
                .send({
                    email: 'abc@test.com',
                    password: '112345678',
                });

            assert.ok(
                ((failedAttempt.statusCode === 401) && (failedAttempt.body.message === 'Incorrect password')),
                failedAttempt.statusCode,
            );
        });

        it('should not login when email incorrect', async (context) => {
            const failedAttempt = await request(app)
                .post('/api/v1/users/auth/login')
                .send({
                    email: 'incorrect@test.com',
                    password: '12345678',
                });

            assert.ok(
                ((failedAttempt.statusCode === 401) && (failedAttempt.body.message === 'Incorrect email')),
                failedAttempt.statusCode,
            );
        });
    });

    describe("Signing up", () => {
        // should sign up successfully
        // don't sign up when email invalid
        // don't sign up when password invalid
        // don't sign up when name invalid
        // don't sign up if already logged in the session
        // don't sign up if the account already exists

        before(() => {
            databaseMock.getAccountIdAndHashFromEmail = async function (email) {
                if (email !== 'valid-accountexists@email.com') return null;
                return {
                    id: 1,
                    pwd_hash: (await bcrypt.hash('12345678', 10)),
                };
            }

            utilityMock.validate = {
                email: function(email) {
                    return email === 'valid@email.com' || email === 'valid-accountexists@email.com';
                },
                password: function(password) {
                    return password === 'valid-password'
                },
                username: function(username) {
                    return username === 'valid username'
                },
            }
        });

        after(() => {
            databaseMock.getAccountIdAndHashFromEmail = undefined;
            utilityMock.validate = undefined;
        });

        it('dont sign up if email invalid', async (context) => {
            const failedAttempt = await request(app)
                .post('/api/v1/users/auth/sign-up')
                .send({
                    email: 'wrong@email.com',
                    password: 'valid-password',
                    username: 'valid username',
                });

            assert.ok(
                ((failedAttempt.statusCode === 400) && (failedAttempt.body.message === 'Invalid email')),
                failedAttempt.statusCode,
            );
        });

        it('dont sign up if password invalid', async (context) => {
            const failedAttempt = await request(app)
                .post('/api/v1/users/auth/sign-up')
                .send({
                    email: 'valid@email.com',
                    password: 'invalid-password',
                    username: 'valid username',
                });

            assert.ok(
                ((failedAttempt.statusCode === 400) && (failedAttempt.body.message === 'Invalid password')),
                failedAttempt.statusCode,
            );
        });

        it('dont sign up if username invalid', async (context) => {
            const failedAttempt = await request(app)
                .post('/api/v1/users/auth/sign-up')
                .send({
                    email: 'valid@email.com',
                    password: 'valid-password',
                    username: 'invalid username',
                });

            assert.ok(
                ((failedAttempt.statusCode === 400) && (failedAttempt.body.message === 'Invalid username')),
                failedAttempt.statusCode,
            );
        });

        it('dont sign up if account already exists', async (context) => {
            const failedAttempt = await request(app)
                .post('/api/v1/users/auth/sign-up')
                .send({
                    email: 'valid-accountexists@email.com',
                    password: 'valid-password',
                    username: 'valid username',
                });

            assert.ok(
                ((failedAttempt.statusCode === 409) && (failedAttempt.body.message === 'An account with this email already exists')),
                failedAttempt.statusCode,
            );
        });

        it('should sign up successfully', async (context) => {
            const passedAttempt = await request(app)
                .post('/api/v1/users/auth/sign-up')
                .send({
                    email: 'valid@email.com',
                    password: 'valid-password',
                    username: 'valid username',
                });

            assert.strictEqual(passedAttempt.statusCode, 302, passedAttempt.body.message);
        });

        it('dont sign up if already logged in', async (context) => {
            const testSession = session(app);

            const passedAttempt = await testSession
                .post('/api/v1/users/auth/sign-up')
                .send({
                    email: 'valid@email.com',
                    password: 'valid-password',
                    username: 'valid username',
                });

            assert.strictEqual(passedAttempt.statusCode, 302, passedAttempt.body.message);

            const failedAttempt = await testSession
                .post('/api/v1/users/auth/sign-up')
                .send({
                    email: 'valid@email.com',
                    password: 'valid-password',
                    username: 'valid username',
                });



            assert.ok(
                ((failedAttempt.statusCode === 400) && (failedAttempt.body.message === 'User is already logged in')),
                failedAttempt.statusCode,
            );
        });
    });
});