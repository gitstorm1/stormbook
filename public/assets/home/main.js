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