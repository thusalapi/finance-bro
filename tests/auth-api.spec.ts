import { test, expect, request } from '@playwright/test';

test.describe('Authenticated API Access - /me endpoint', () => {
    const baseURL = 'http://localhost:5000/api/auth';
    const uniqueEmail = `user_${Date.now()}@example.com`;
    const password = 'StrongPass123!';
    let token: string;
    let expectedUserData: {
        _id: string;
        email: string;
        name: string;
        role: string;
    };

    test('should return user data after login and fetch /me', async () => {
        const apiContext = await request.newContext();

        // Step 1: Register a user
        const registerResponse = await apiContext.post(`${baseURL}/register`, {
            data: {
                name: 'Playwright Test User',
                email: uniqueEmail,
                password,
                role: 'user', // or leave it out to default to 'user'
            },
        });

        expect(registerResponse.status()).toBe(201);
        const registerBody = await registerResponse.json();

        token = registerBody.token;
        expect(token).toBeTruthy();

        // Step 2: Fetch /me using token
        const authedContext = await request.newContext({
            extraHTTPHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });

        const meResponse = await authedContext.get(`${baseURL}/me`);
        expect(meResponse.status()).toBe(200);

        const meData = await meResponse.json();
        console.log('Fetched /me data:', meData);

        // Step 3: Assertions
        expect(meData).toHaveProperty('_id');
        expect(meData).toHaveProperty('email', uniqueEmail);
        expect(meData).toHaveProperty('name', 'Playwright Test User');
        expect(meData).toHaveProperty('role', 'user');

        // Optionally save for later test chaining
        expectedUserData = meData;
    });
});
