"use strict";

import * as test from '../interface.js';

console.log('Script loaded.');

console.log(test.userId);
console.log(await test.getUsername());
console.log(await test.getAbout());
console.log(await test.getPfpUrl());