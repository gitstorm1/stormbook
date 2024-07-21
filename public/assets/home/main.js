"use strict";

import * as test from '../interface.js';

console.log('Script loaded.');

for (const property in test) {
    console.log('----------------------');
    console.log(property, ':', test[property]());
    console.log('----------------------');
}