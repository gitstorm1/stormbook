"use strict";

export const userId = await (await fetch('/api/my-user-id')).text();

async function getField(field) {
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
    return getField('username');
}

export function getPfpUrl() {
    return getField('pfp_url');
}

export function getAbout() {
    return getField('about');
}

export function getFeedGroup(before = new Date()) {
    console.log('Return the last 10 posts before', before.toString());
    return [];
}

export function getFriendsList() {
    console.log('Return friends list');
    return [];
}