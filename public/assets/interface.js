"use strict";

export function getUsername() {
    return 'USERNAME';
}

export function getProfilePicture() {
    console.log('Returning default profile picture');
    return 'https://i.sstatic.net/l60Hf.png';
}

export function getAbout() {
    console.log('Returning about section text');
    return 'ABOUT TEXT';
}

export function getFeedGroup(before = new Date()) {
    console.log('Return the last 10 posts before', before.toString());
    return [];
}

export function getFriendsList() {
    console.log('Return friends list');
    return [];
}