"use strict";

export const userId = await (await fetch('/api/my-user-id')).text();

async function getUserField(field) {
    try {
        const response = await fetch(`/api/users/${userId}/${field}`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.text();
    } catch(err) {
        console.error(err);
        return 'ERROR';
    }
}

export function getUsername() {
    return getUserField('username');
}

export function getPfpUrl() {
    return getUserField('pfp_url');
}

export function getAbout() {
    return getUserField('about');
}

export function getFeedGroup(before = new Date()) {
    console.log('Return the last 10 posts before', before.toString());
    return [];
}

export async function getFriendsList() {
    try {
        const response = await fetch(`/api/users/${userId}/friends-list`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch(err) {
        console.error(err);
        return [];
    }
}

export async function getIncomingFriendRequests() {
    try {
        const response = await fetch(`/api/users/${userId}/friend-requests/incoming`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch(err) {
        console.error(err);
        return [];
    }
}