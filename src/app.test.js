import { describe, it, mock } from 'node:test';
import assert from 'node:assert';

import request from "supertest";

import { createApp } from "./app.js";

const databaseMock = {
    getAccountIdAndHashFromEmail: (email) => {
        return {
            id: 1,
            pwd_hash: 'fake_hash',
        }
    }
}

const app = createApp(databaseMock);

describe('Authentication', () => {
    it('should login successfully', async (done) => {
        const res = await request(app)
        .post('/api/users/auth/login')
        .send({
            email: "abc@test.com",
            password: "12345678",
        });
        assert.strictEqual(res.statusCode, 200);
        done();
    });
});