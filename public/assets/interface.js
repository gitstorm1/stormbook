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
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

export async function acceptFriendRequest(senderId) {
    /*
    
    Send POST request with the senderId

    Log any errors

    */

    try {
        const response = await fetch(
            `/api/accept-friend-request`,
            {
                method: 'POST',
                body: JSON.stringify({senderId: senderId}),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        console.log('Accept friend-request completed for sender ID:', senderId);
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

export async function declineFriendRequest(senderId) {
    /*
    
    Send POST request with the senderId

    Log any errors

    */

    try {
        const response = await fetch(
            `/api/decline-friend-request`,
            {
                method: 'POST',
                body: JSON.stringify({senderId: senderId}),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        console.log('Decline friend-request completed for sender ID:', senderId);
        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

export async function createPost(content) {
    if ((!content) || (content.length < 8)) return false;

    try {
        const response = await fetch(
            `/api/create-post`,
            {
                method: 'POST',
                body: JSON.stringify({content: content}),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        console.log('Created a post with content:', content);

        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

export async function deletePost(postId) {
    try {
        const response = await fetch(
            `/api/delete-post`,
            {
                method: 'POST',
                body: JSON.stringify({postId: postId}),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        console.log('Deleted the post of ID:', postId);

        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}

export async function likeUnlikePostToggle(postId) {
    try {
        const response = await fetch(
            `/api/like-unlike-post-toggle`,
            {
                method: 'POST',
                body: JSON.stringify({postId: postId}),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        console.log('Changed the like status of post:', postId);

        return true;
    } catch(err) {
        console.error(err);
        return false;
    }
}