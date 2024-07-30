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
        return 'Could not fetch';
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

export async function getOutgoingFriendRequests() {
    try {
        const response = await fetch(`/api/users/${userId}/friend-requests/outgoing`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    } catch(err) {
        console.error(err);
        return [];
    }
}

export async function sendFriendRequest(targetId) {
    /*
    
    Send POST request with the targetId

    Log any errors

    */

    try {
        const response = await fetch(
            `/api/send-friend-request`,
            {
                method: 'POST',
                body: JSON.stringify({targetId: targetId}),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        console.log('Request friend-request completed for target ID:', targetId);
    } catch(err) {
        console.error(err);
    }
}

export async function acceptFriendRequest(senderId) {
    /*
    
    Send POST request with the senderId

    Log any errors

    */
}

export async function declineFriendRequest(senderId) {
    /*
    
    Send POST request with the senderId

    Log any errors

    */
}