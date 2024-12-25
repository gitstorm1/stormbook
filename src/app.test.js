import { describe, it } from 'node:test';
import assert from 'node:assert';

import request from "supertest";

import { createApp } from "./app.js";

const app = createApp();

describe('Authentication', () => {
    it('should login successfully', async () => {
        const res = await request(app)
        .post('/api/users/auth/login')
        .send({
            email: "testemail@example.com",
            password: "testpassword123",
        });
        assert.strictEqual(res.statusCode, 200);
    });
});