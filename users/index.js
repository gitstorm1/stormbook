import signUpModule from './sign-up/index.js';
import loginModule from './login/index.js';

async function initialize(app) {
    await signUpModule.initialize(app);

    await loginModule.initialize(app);
}

export default { initialize: initialize };