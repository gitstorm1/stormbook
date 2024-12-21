import signUpModule from './sign-up/index.js';
import loginModule from './login/index.js';
import logoutModule from './logout-get.js';

async function initialize(app) {
    await signUpModule.initialize(app);

    await loginModule.initialize(app);

    await logoutModule.initialize(app);
}

export default { initialize: initialize };