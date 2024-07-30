"use strict";

import * as test from '../interface.js';

console.log('Script loaded.');

console.log(test.userId);
console.log(await test.getUsername());
console.log(await test.getAbout());
console.log(await test.getPfpUrl());
console.log(await test.getFriendsList());
console.log(await test.getIncomingFriendRequests());
console.log(await test.getOutgoingFriendRequests());
await test.sendFriendRequest('a000bd19-3a5a-4c97-8d2a-d948ebf54814');
//await test.acceptFriendRequest('a000bd19-3a5a-4c97-8d2a-d948ebf54814');
await test.declineFriendRequest('9496196d-5d5c-444f-be0c-419f7a749ebb');

window.createPost = function(...args) {
    test.createPost(...args)
    .then((success) => {
        console.log('Create post successful?', success);
    })
    .catch((err) => {
        throw err;
    });
}